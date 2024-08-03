import {
  Controller,
  Body,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ZodValidationPipePipe } from 'src/common/pipes/zod-validation-pipe.pipe';
import {
  loginSchema,
  signupSchema,
  TLoginDto,
  TSignupDto,
} from './dto/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async auth() {
    return this.authService.auth();
  }

  @Post('signup')
  @UsePipes(new ZodValidationPipePipe(signupSchema))
  async signup(@Body() signupDto: TSignupDto) {
    return this.authService.signup(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipePipe(loginSchema))
  async login(@Body() loginDto: TLoginDto) {
    return this.authService.login(loginDto);
  }
}
