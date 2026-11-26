import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { JwtAuthGuard } from './jwt-auth.guard.js';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: { verifyAsync: ReturnType<typeof vi.fn> };

  function createContext(authorization?: string) {
    const request = {
      headers: authorization ? { authorization } : {},
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return { context, request };
  }

  beforeEach(() => {
    vi.resetAllMocks();

    jwtService = {
      verifyAsync: vi.fn(),
    };

    guard = new JwtAuthGuard(jwtService as unknown as JwtService);
  });

  it('deve rejeitar quando o header Authorization não for informado', async () => {
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('deve rejeitar quando o header não utilizar o prefixo Bearer', async () => {
    const { context } = createContext('Basic token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('deve rejeitar quando o token for inválido', async () => {
    const { context } = createContext('Bearer invalid-token');

    jwtService.verifyAsync.mockRejectedValue(new Error('Token inválido'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve rejeitar quando o token estiver expirado', async () => {
    const { context } = createContext('Bearer expired-token');

    jwtService.verifyAsync.mockRejectedValue(new Error('Token expirado'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve permitir acesso e atribuir o payload à requisição quando o token for válido', async () => {
    const payload = { sub: 'user-123' };
    const { context, request } = createContext('Bearer valid-token');

    jwtService.verifyAsync.mockResolvedValue(payload);

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(request).toHaveProperty('user', payload);
  });
});
