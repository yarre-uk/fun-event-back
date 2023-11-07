import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { JWTUserDTO } from './dtos/user.dto.js';
import { UserDTO } from '../users/dtos/user.dto.js';
import {
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
} from '../../constants/auth.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  createToken = (payload: JWTUserDTO, expiresInSeconds: number) => {
    return this.jwtService.signAsync(payload, {
      expiresIn: `${expiresInSeconds}ms`,
    });
  };

  async signInUser(
    userDTO: UserDTO,
    withRefreshToken: boolean,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const user = await this.usersService.findOne(userDTO);

    if (!user) {
      throw new UnauthorizedException(
        `Cant find user with such credentials: ${JSON.stringify(userDTO)}`,
      );
    }

    const payload = { id: user.id, email: user.email };

    const accessTokenPromise = this.createToken(payload, ACCESS_TOKEN_EXPIRES);

    if (withRefreshToken) {
      const refreshTokenPromise = this.createToken(
        payload,
        REFRESH_TOKEN_EXPIRES,
      );

      const [accessToken, refreshToken] = await Promise.all([
        accessTokenPromise,
        refreshTokenPromise,
      ]);

      return {
        accessToken,
        refreshToken,
      };
    }

    return {
      accessToken: await accessTokenPromise,
    };
  }

  async signUpUser(userDTO: UserDTO) {
    const user = await this.usersService.create(userDTO);

    const payload = { id: user.id, email: user.email };

    const access = this.createToken(payload, ACCESS_TOKEN_EXPIRES);
    const refresh = this.createToken(payload, REFRESH_TOKEN_EXPIRES);

    const [accessToken, refreshToken] = await Promise.all([access, refresh]);

    return { accessToken, refreshToken };
  }
}
