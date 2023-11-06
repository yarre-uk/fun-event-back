import { Request } from 'express';
import { JWTUserDTO } from './dtos/user.dto';

export interface AuthRequest extends Request {
  user: JWTUserDTO;
}
