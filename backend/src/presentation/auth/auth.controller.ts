import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { LoginDto } from './login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: result.userId,
    });

    return {
      access_token: accessToken,
    };
  }
}