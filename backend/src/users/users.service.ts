import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { User } from '../database/entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const safeUser = ({ password: _password, ...user }: User) => user;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(input: CreateUserDto) {
    const email = input.email.trim().toLowerCase();
    if (await this.userRepo.findOneBy({ email }))
      throw new ConflictException('An account with this email already exists');
    const password = await bcrypt.hash(input.password, 12);
    try {
      const user = await this.userRepo.save(
        this.userRepo.create({
          id: randomUUID(),
          name: input.name.trim(),
          email,
          password,
          updatedAt: new Date(),
        }),
      );
      return safeUser(user);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async findById(id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return safeUser(user);
  }

  async update(id: string, input: UpdateUserDto) {
    const changes: Partial<User> = {};
    if (input.name !== undefined) changes.name = input.name.trim();
    if (input.email !== undefined)
      changes.email = input.email.trim().toLowerCase();
    // Only explicitly supported profile fields can be changed here.
    // Password changes go through AuthService to verify credentials and revoke sessions.
    if (!Object.keys(changes).length) return this.findById(id);
    try {
      const result = await this.userRepo.update(id, {
        ...changes,
        updatedAt: new Date(),
      });
      if (!result.affected) throw new NotFoundException('User not found');
      return await this.findById(id);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async delete(id: string): Promise<void> {
    // Prisma's foreign keys cascade deletion to refresh and password-reset tokens.
    const result = await this.userRepo.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
  }

  private handleWriteError(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string }).code === '23505'
    ) {
      throw new ConflictException('An account with this email already exists');
    }
    throw error;
  }
}
