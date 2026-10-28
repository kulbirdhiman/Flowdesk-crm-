import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';
import {
  User,
  UserRole,
  UserStatus,
} from '../database/entities/user.entity.js';
import { RefreshToken } from '../database/entities/refresh-token.entity.js';
import { PasswordResetToken } from '../database/entities/password-reset-token.entity.js';
import { EmailService } from '../email/email.service.js';

describe('AuthService', () => {
  let service: AuthService;
  const users = {
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    createQueryBuilder: vi.fn(),
  };
  const sessions = { update: vi.fn(), findOneBy: vi.fn() };
  const resets = { findOneBy: vi.fn() };
  const jwt = { verifyAsync: vi.fn() };
  const email = { sendPasswordReset: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useValue: users },
        { provide: getRepositoryToken(RefreshToken), useValue: sessions },
        { provide: getRepositoryToken(PasswordResetToken), useValue: resets },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: { get: () => 'localhost' } },
        { provide: DataSource, useValue: {} },
        { provide: EmailService, useValue: email },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('hashes passwords, normalizes email, and excludes the password from registration', async () => {
    users.findOneBy.mockResolvedValue(null);
    users.create.mockImplementation((data) => data);
    users.save.mockImplementation((data) => ({
      ...data,
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
    }));
    const result = await service.register({
      name: ' Sam ',
      email: ' SAM@example.com ',
      password: 'a-strong-password',
    });
    const saved = users.save.mock.calls[0]![0];
    expect(await bcrypt.compare('a-strong-password', saved.password)).toBe(
      true,
    );
    expect(saved.email).toBe('sam@example.com');
    expect(saved.name).toBe('Sam');
    expect(saved.role).toBeUndefined();
    expect(result).not.toHaveProperty('password');
  });

  it('rejects duplicate emails', async () => {
    users.findOneBy.mockResolvedValue({ id: 'existing' });
    await expect(
      service.register({
        name: 'Sam',
        email: 'sam@example.com',
        password: 'a-strong-password',
      }),
    ).rejects.toThrow('already exists');
    expect(users.save).not.toHaveBeenCalled();
  });

  it('returns the same login failure for an unknown email', async () => {
    const query = {
      addSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      getOne: vi.fn().mockResolvedValue(null),
    };
    users.createQueryBuilder.mockReturnValue(query);
    await expect(
      service.login({
        email: 'unknown@example.com',
        password: 'a-strong-password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('rejects access tokens whose session was revoked', async () => {
    jwt.verifyAsync.mockResolvedValue({ sub: 'user', sid: 'session' });
    sessions.findOneBy.mockResolvedValue(null);
    await expect(service.authenticate('token')).rejects.toThrow(
      'Invalid or expired access token',
    );
  });

  it('never returns a reset token for unknown accounts', async () => {
    users.findOneBy.mockResolvedValue(null);
    expect(await service.requestPasswordReset('unknown@example.com')).toEqual({
      message: expect.any(String),
    });
    expect(email.sendPasswordReset).not.toHaveBeenCalled();
  });
});
