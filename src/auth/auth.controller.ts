import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  Body,
  Query,
  UsePipes,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

import { Public } from 'src/common/decorators/public.decorator';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe.pipe';
import {
  signupSchema,
  loginSchema,
  TSignupDto,
  TLoginDto,
} from 'src/users/dto/users.dto';

import { registerSwaggerDocs } from './swagger-docs/register.doc';
import { loginSwaggerDocs } from './swagger-docs/login.doc';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getAuthDetail(@Req() req) {
    return req.user;
  }

  @Public()
  @UsePipes(new ZodValidationPipe(signupSchema))
  @Post('register')
  @registerSwaggerDocs.operation
  @registerSwaggerDocs.body
  @registerSwaggerDocs.responses_1
  @registerSwaggerDocs.responses_2
  async register(@Body() signupDto: TSignupDto) {
    await this.usersService.create(signupDto);
    return {
      message:
        'User registered successfully. Please check your email to verify your account.',
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  @Post('login')
  @loginSwaggerDocs.operation
  @loginSwaggerDocs.body
  @loginSwaggerDocs.responses_1
  @loginSwaggerDocs.responses_2
  async login(
    @Body() loginDto: TLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }
    if (!user.is_verified) {
      throw new HttpException('Email not verified.', HttpStatus.UNAUTHORIZED);
    }
    const accessToken = await this.authService.getAccessToken(user);
    const refreshToken = await this.authService.getRefreshToken(user);

    await this.authService.storeRefreshToken(user.id, refreshToken);
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true });

    return { access_token: accessToken };
  }

  @Public()
  @Get('refresh-token')
  async refresh(@Req() req) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }

    const decoded = this.authService.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(decoded.id);
    if (!user || user.refresh_token !== refreshToken) {
      throw new HttpException('Invalid token.', HttpStatus.FORBIDDEN);
    }

    const accessToken = await this.authService.getAccessToken(user);
    return { access_token: accessToken };
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    await this.usersService.verifyEmail(token);
    return { message: 'Email verified successfully.' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }
    const decoded = this.authService.verifyRefreshToken(refreshToken);
    await this.authService.removeRefreshToken(decoded.id);

    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully.' };
  }
}
