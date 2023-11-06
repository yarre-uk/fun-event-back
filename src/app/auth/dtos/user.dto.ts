export class JWTUserDTO {
  id: number;
  email: string;
}

export class UserDTOVerified {
  id: number;
  email: string;
  iat: number;
  exp: number;
}
