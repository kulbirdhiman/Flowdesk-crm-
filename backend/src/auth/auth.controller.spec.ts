import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  const auth = { login: vi.fn(), refresh: vi.fn() };
  const controller = new AuthController(
    auth as unknown as AuthService,
    new ConfigService({ FRONTEND_URL: 'http://localhost:3000' }),
  );

  it('blocks cookie-changing requests from an untrusted origin', async () => {
    const request = {
      get: (name: string) =>
        name === 'origin' ? 'https://untrusted.example' : undefined,
    } as Request;
    await expect(controller.refresh(request, {} as Response)).rejects.toThrow(
      'Origin is not allowed',
    );
    expect(auth.refresh).not.toHaveBeenCalled();
  });

  it('keeps refresh tokens out of the response body and sets an HTTP-only cookie', async () => {
    auth.login.mockResolvedValue({
      accessToken: 'access',
      refreshToken: { plaintext: 'secret', expiresAt: new Date() },
      user: { id: 'user' },
    });
    const cookie = vi.fn();
    const response = await controller.login(
      { email: 'sam@example.com', password: 'password' },
      { get: () => undefined } as unknown as Request,
      { cookie } as unknown as Response,
    );
    expect(response).toEqual({ accessToken: 'access', user: { id: 'user' } });
    expect(cookie).toHaveBeenCalledWith(
      'refresh_token',
      'secret',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/auth',
      }),
    );
  });
});
