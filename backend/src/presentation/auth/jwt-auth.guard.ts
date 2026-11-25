import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não informado');
    }

    const token = authorization.slice(7);

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);

      if (!payload.sub) {
        throw new UnauthorizedException('Token inválido');
      }

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}