import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource, IsNull, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { User, UserStatus } from '../database/entities/user.entity.js';
import { RefreshToken } from '../database/entities/refresh-token.entity.js';
import { PasswordResetToken } from '../database/entities/password-reset-token.entity.js';
import { UsersService } from '../users/users.service.js';
import { EmailService } from '../email/email.service.js';
import type {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
} from './dto/auth.dto.js';

const COST = 12;
const FORGOT_MESSAGE =
  'If an account exists for that email, a password reset link has been sent.';
// A valid, cost-matched dummy hash keeps unknown-user checks expensive too.
const DUMMY_HASH = bcrypt.hashSync(randomBytes(32).toString('hex'), COST);
export const publicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});
const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepo: Repository<PasswordResetToken>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  async register(input: RegisterDto) {
    const user = await this.usersService.create(input);
    this.logger.log({ event: 'USER_REGISTERED', userId: user.id });
    return user;
  }

  async login(input: LoginDto) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: input.email.trim().toLowerCase() })
      .getOne();
    const ok = await bcrypt.compare(
      input.password,
      user?.password ?? DUMMY_HASH,
    );
    if (!user || !ok || user.status !== UserStatus.ACTIVE) {
      this.logger.warn({ event: 'LOGIN_FAILED' });
      throw new UnauthorizedException('Invalid email or password');
    }
    const plaintext = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 86400000);
    const session = await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        id: randomUUID(),
        userId: user.id,
        tokenHash: hashToken(plaintext),
        expiresAt,
        revokedAt: null,
        lastUsedAt: null,
      }),
    );
    this.logger.log({ event: 'LOGIN_SUCCESS', userId: user.id });
    return {
      accessToken: await this.signAccessToken(user, session.id),
      refreshToken: { plaintext, expiresAt },
      user: publicUser(user),
    };
  }

  async refresh(plaintext: string) {
    const nextToken = randomBytes(32).toString('hex');
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(RefreshToken);
      const session = await repo.findOne({
        where: {
          tokenHash: hashToken(plaintext),
          revokedAt: IsNull(),
          expiresAt: MoreThan(new Date()),
        },
        lock: { mode: 'pessimistic_write' },
      });
      if (!session)
        throw new UnauthorizedException(
          'Refresh token is missing, expired, or revoked',
        );
      const user = await manager
        .getRepository(User)
        .findOneBy({ id: session.userId, status: UserStatus.ACTIVE });
      if (!user) throw new UnauthorizedException('Session is no longer valid');
      // Rotate the token; its original seven-day expiry remains an absolute limit.
      session.tokenHash = hashToken(nextToken);
      session.lastUsedAt = new Date();
      await repo.save(session);
      return {
        accessToken: await this.signAccessToken(user, session.id),
        refreshToken: { plaintext: nextToken, expiresAt: session.expiresAt },
        user: publicUser(user),
      };
    });
  }

  async logout(plaintext?: string) {
    if (plaintext)
      await this.refreshTokenRepo.update(
        { tokenHash: hashToken(plaintext), revokedAt: IsNull() },
        { revokedAt: new Date() },
      );
  }

  async authenticate(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        sid: string;
      }>(token);
      if (typeof payload.sub !== 'string' || typeof payload.sid !== 'string')
        throw new Error('Invalid claims');
      const session = await this.refreshTokenRepo.findOneBy({
        id: payload.sid,
        userId: payload.sub,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      });
      const user =
        session &&
        (await this.userRepo.findOneBy({
          id: payload.sub,
          status: UserStatus.ACTIVE,
        }));
      if (!user) throw new Error('Invalid session');
      return publicUser(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async changePassword(userId: string, input: ChangePasswordDto) {
    if (input.currentPassword === input.newPassword)
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    await this.dataSource.transaction(async (manager) => {
      const user = await manager
        .getRepository(User)
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.id = :userId AND user.status = :status', {
          userId,
          status: UserStatus.ACTIVE,
        })
        .setLock('pessimistic_write')
        .getOne();
      if (
        !user ||
        !(await bcrypt.compare(input.currentPassword, user.password))
      )
        throw new UnauthorizedException('Current password is incorrect');
      user.password = await bcrypt.hash(input.newPassword, COST);
      user.updatedAt = new Date();
      await manager.getRepository(User).save(user);
      await manager
        .getRepository(RefreshToken)
        .update({ userId, revokedAt: IsNull() }, { revokedAt: new Date() });
      await manager
        .getRepository(PasswordResetToken)
        .update({ userId, usedAt: IsNull() }, { usedAt: new Date() });
    });
    this.logger.log({ event: 'PASSWORD_CHANGED', userId });
  }

  async requestPasswordReset(email: string) {
    // Check mail configuration for both known and unknown addresses.
    if (!this.config.get<string>('SMTP_HOST'))
      throw new ServiceUnavailableException(
        'Password reset email is not configured',
      );
    const user = await this.userRepo.findOneBy({
      email: email.trim().toLowerCase(),
      status: UserStatus.ACTIVE,
    });
    if (user) {
      const plaintext = randomBytes(32).toString('hex');
      await this.dataSource.transaction(async (manager) => {
        await manager.getRepository(User).findOne({
          where: { id: user.id },
          lock: { mode: 'pessimistic_write' },
        });
        const repo = manager.getRepository(PasswordResetToken);
        await repo.update(
          { userId: user.id, usedAt: IsNull() },
          { usedAt: new Date() },
        );
        await repo.save(
          repo.create({
            id: randomUUID(),
            userId: user.id,
            tokenHash: hashToken(plaintext),
            expiresAt: new Date(Date.now() + 3600000),
            usedAt: null,
          }),
        );
      });
      try {
        await this.emailService.sendPasswordReset(user.email, plaintext);
      } catch {
        this.logger.error({
          event: 'PASSWORD_RESET_EMAIL_FAILED',
          userId: user.id,
        });
      }
    }
    return { message: FORGOT_MESSAGE };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.passwordResetTokenRepo.findOneBy({
      tokenHash: hashToken(token),
    });
    if (!record)
      throw new BadRequestException(
        'Reset token is invalid, expired, or already used',
      );
    const password = await bcrypt.hash(newPassword, COST);
    await this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const user = await users.findOne({
        where: { id: record.userId, status: UserStatus.ACTIVE },
        lock: { mode: 'pessimistic_write' },
      });
      const consumed =
        user &&
        (await manager.getRepository(PasswordResetToken).update(
          {
            id: record.id,
            usedAt: IsNull(),
            expiresAt: MoreThan(new Date()),
          },
          { usedAt: new Date() },
        ));
      if (!user || !consumed || consumed.affected !== 1)
        throw new BadRequestException(
          'Reset token is invalid, expired, or already used',
        );
      user.password = password;
      user.updatedAt = new Date();
      await users.save(user);
      await manager
        .getRepository(RefreshToken)
        .update(
          { userId: user.id, revokedAt: IsNull() },
          { revokedAt: new Date() },
        );
    });
    this.logger.log({ event: 'PASSWORD_RESET', userId: record.userId });
  }

  private signAccessToken(user: User, sessionId: string) {
    return this.jwtService.signAsync({
      sub: user.id,
      sid: sessionId,
      role: user.role,
      name: user.name,
    });
  }
}
