import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response, CookieOptions } from 'express';
import { AuthService } from './auth.service.js';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto.js';
import { JwtAuthGuard, type AuthRequest } from './jwt-auth.guard.js';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  register(@Body() input: RegisterDto) {
    return this.auth.register(input);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() input: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.checkOrigin(request);
    const result = await this.auth.login(input);
    this.setCookie(response, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.checkOrigin(request);
    const token = this.cookieToken(request);
    if (!token) throw new UnauthorizedException('Refresh token is required');
    const result = await this.auth.refresh(token);
    this.setCookie(response, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.checkOrigin(request);
    await this.auth.logout(this.cookieToken(request));
    response.clearCookie('refresh_token', this.cookieOptions());
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthRequest) {
    return request.user;
  }

  @Post('change-password')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() request: AuthRequest,
    @Body() input: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.auth.changePassword(request.user.id, input);
    response.clearCookie('refresh_token', this.cookieOptions());
  }

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() input: ForgotPasswordDto) {
    return this.auth.requestPasswordReset(input.email);
  }

  @Post('reset-password')
  @HttpCode(204)
  async resetPassword(
    @Body() input: ResetPasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.auth.resetPassword(input.token, input.newPassword);
    response.clearCookie('refresh_token', this.cookieOptions());
  }

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get<string>('COOKIE_SECURE') === 'true',
      sameSite: 'lax',
      path: '/auth',
    };
  }
  private setCookie(
    response: Response,
    token: { plaintext: string; expiresAt: Date },
  ) {
    response.cookie('refresh_token', token.plaintext, {
      ...this.cookieOptions(),
      expires: token.expiresAt,
    });
  }
  private cookieToken(request: Request): string | undefined {
    const value: unknown = request.cookies?.refresh_token;
    return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
      ? value
      : undefined;
  }
  private checkOrigin(request: Request) {
    const origin = request.get('origin');
    const allowed =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    if (
      (origin && origin !== allowed) ||
      request.get('sec-fetch-site') === 'cross-site'
    )
      throw new ForbiddenException('Origin is not allowed');
  }
}
