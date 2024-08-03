import { Injectable } from '@nestjs/common';
import { TSignupDto, TLoginDto } from './dto/users.dto';

@Injectable()
export class AuthService {
  async auth() {}

  async signup(body: TSignupDto) {}

  async login(body: TLoginDto) {}
}
