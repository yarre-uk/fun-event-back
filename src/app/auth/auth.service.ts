import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { JWTUserDTO, SignInDTO, SignUpDTO } from './dtos/user.dto.js';
import { UserDTO } from '../users/dtos/user.dto.js';
import {
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  SECRET,
} from '../../constants/auth.js';
import { ConfigService } from '@nestjs/config';
import { AES, enc } from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createToken = (payload: JWTUserDTO, expiresInSeconds: number) => {
    return this.jwtService.signAsync(payload, {
      expiresIn: `${expiresInSeconds}ms`,
    });
  };

  async signInUser(
    userDTO: SignInDTO,
    withRefreshToken: boolean,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const user = await this.usersService.findOne({ email: userDTO.email });

    if (!user) {
      throw new UnauthorizedException(
        `Cant find user with such credentials: ${JSON.stringify(userDTO)}`,
      );
    }

    if (
      userDTO.password !==
      this.decrypt(user.password, this.configService.get<string>(SECRET))
    ) {
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

  async signUpUser(userDTO: SignUpDTO) {
    if (await this.usersService.findOne({ email: userDTO.email })) {
      throw new BadRequestException('Email is already taken');
    }

    userDTO.password = this.crypt(
      userDTO.password,
      this.configService.get<string>(SECRET),
    );

    const user = await this.usersService.create(userDTO);

    const payload = { id: user.id, email: user.email };

    const access = this.createToken(payload, ACCESS_TOKEN_EXPIRES);
    const refresh = this.createToken(payload, REFRESH_TOKEN_EXPIRES);

    const [accessToken, refreshToken] = await Promise.all([access, refresh]);

    return { accessToken, refreshToken };
  }

  crypt(stringToCrypt: string, salt: string): string {
    return AES.encrypt(stringToCrypt, salt).toString();
  }

  decrypt(stringToDecrypt: string, salt: string): string {
    const bytes = AES.decrypt(stringToDecrypt, salt);
    return bytes.toString(enc.Utf8);
  }
}
