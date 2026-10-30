import { UsersModule } from '../users/users.module.js';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { User } from '../database/entities/user.entity.js';
import { RefreshToken } from '../database/entities/refresh-token.entity.js';
import { PasswordResetToken } from '../database/entities/password-reset-token.entity.js';
import { EmailService } from '../email/email.service.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, RefreshToken, PasswordResetToken]),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        if (secret.length < 32)
          throw new Error('JWT_SECRET must contain at least 32 characters');
        return {
          secret,
          signOptions: {
            expiresIn: '15m',
            algorithm: 'HS256',
            issuer: 'crm-backend',
            audience: 'crm-frontend',
          },
          verifyOptions: {
            algorithms: ['HS256'],
            issuer: 'crm-backend',
            audience: 'crm-frontend',
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtAuthGuard, EmailService],
  controllers: [AuthController],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
