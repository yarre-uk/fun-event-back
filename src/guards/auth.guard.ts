import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import {
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRES,
  SECRET,
} from '../constants/auth';
import { JWTUserDTO, UserDTOVerified } from '../app/auth/dtos/user.dto';
import { AuthRequest } from '../app/auth/auth-request.interface';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private repo: Repository<User>,
    private reflector: Reflector,
  ) {}

  private createToken = (payload: JWTUserDTO, expiresInSeconds: number) => {
    return this.jwtService.signAsync(payload, {
      expiresIn: `${expiresInSeconds}ms`,
    });
  };

  private verifyAsync = async (
    token: string | undefined,
  ): Promise<JWTUserDTO | undefined> => {
    if (!token) {
      return undefined;
    }

    try {
      const payload = await this.jwtService.verifyAsync<
        Partial<UserDTOVerified>
      >(token, {
        secret: this.configService.get<string>(SECRET),
      });

      delete payload.iat;
      delete payload.exp;

      return payload as JWTUserDTO;
    } catch {
      return undefined;
    }
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requestRole = this.reflector.get(Roles, context.getHandler());

    const request: AuthRequest = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const accessToken = this.extractTokenFromHeader(request);
    const refreshToken = this.extractTokenFromCookies(request);

    const [accessPayload, refreshPayload] = await Promise.all([
      this.verifyAsync(accessToken),
      this.verifyAsync(refreshToken),
    ]);

    if (!accessPayload && !refreshPayload) {
      throw new UnauthorizedException();
    }

    if (accessPayload) {
      request.user = accessPayload;
    } else if (refreshPayload) {
      request.user = refreshPayload;

      const newAccessPromise = this.createToken(
        refreshPayload,
        ACCESS_TOKEN_EXPIRES,
      );

      const newRefreshPromise = this.createToken(
        refreshPayload,
        REFRESH_TOKEN_EXPIRES,
      );

      const [newAccessToken, newRefreshToken] = await Promise.all([
        newAccessPromise,
        newRefreshPromise,
      ]);

      this.setTokenToHeader(response, newAccessToken);
      this.setTokenToCookies(response, newRefreshToken);
    }

    const user = await this.repo.findOne({
      where: { id: request.user.id },
    });

    request.user.data = user;

    if (!requestRole) {
      return true;
    }

    if (requestRole == 'Admin' && user.role == 'Admin') {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }

  private extractTokenFromHeader(request: AuthRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookies(request: AuthRequest): string | undefined {
    const token: string | undefined =
      request.cookies[REFRESH_TOKEN] ?? undefined;

    return token;
  }

  private setTokenToHeader(response: Response, token: string) {
    response.setHeader('Authorization', `Bearer ${token}`);
  }

  private setTokenToCookies(response: Response, token: string) {
    response.cookie(REFRESH_TOKEN, token, {
      maxAge: REFRESH_TOKEN_EXPIRES,
      httpOnly: true,
    });
  }
}
