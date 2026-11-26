import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

const BEARER_PREFIX = 'Bearer ';

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
    const token = this.extractBearerToken(request);

    request.user = await this.verifyToken(token);

    return true;
  }

  private extractBearerToken(request: AuthenticatedRequest): string {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedException('Token não informado');
    }

    return authorization.slice(BEARER_PREFIX.length);
  }

  private async verifyToken(token: string): Promise<{ sub: string }> {
    let payload: { sub: string };

    try {
      payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    return payload;
  }
}