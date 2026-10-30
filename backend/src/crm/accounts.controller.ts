import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { IsEnum, IsOptional } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { RegisterDto } from '../auth/dto/auth.dto.js';
import { JwtAuthGuard, type AuthRequest } from '../auth/jwt-auth.guard.js';
import { UserRole, UserStatus } from '../database/entities/user.entity.js';
import { PrismaService } from '../prisma/prisma.service.js';
class AccountDto extends RegisterDto {
  @IsOptional() @IsEnum(UserRole) role?: UserRole;
}
class AccountAccessDto {
  @IsOptional() @IsEnum(UserRole) role?: UserRole;
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
}
const select = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
} as const;
@Controller('crm/accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly prisma: PrismaService) {}
  private admin(req: AuthRequest) {
    if (req.user.role !== 'ADMIN')
      throw new ForbiddenException('Administrator access is required');
  }
  @Get()
  list(@Req() req: AuthRequest) {
    this.admin(req);
    return this.prisma.user.findMany({ select, orderBy: { name: 'asc' } });
  }
  @Post()
  async create(@Body() input: AccountDto, @Req() req: AuthRequest) {
    this.admin(req);
    try {
      return await this.prisma.user.create({
        data: {
          id: randomUUID(),
          email: input.email.trim().toLowerCase(),
          name: input.name.trim(),
          password: await bcrypt.hash(input.password, 12),
          role: input.role || 'EMPLOYEE',
        },
        select,
      });
    } catch (e: any) {
      if (e.code === 'P2002')
        throw new ConflictException(
          'An account with this email already exists',
        );
      throw e;
    }
  }
  @Patch(':id')
  async access(
    @Param('id') id: string,
    @Body() input: AccountAccessDto,
    @Req() req: AuthRequest,
  ) {
    this.admin(req);
    if (id === req.user.id)
      throw new ForbiddenException(
        'Use a different administrator to change your own access',
      );
    try {
      return await this.prisma.user.update({
        where: { id },
        data: input,
        select,
      });
    } catch (error: any) {
      if (error.code === 'P2025')
        throw new NotFoundException('Account not found');
      throw error;
    }
  }
}
