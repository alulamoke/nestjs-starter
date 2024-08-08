import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';

import { Public } from '@/common/decorators/public.decorator';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { RegisterSwagger } from './swagger/register.swagger';
import { LoginSwagger } from './swagger/login.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiBearerAuth()
  getAuthDetail(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  @RegisterSwagger.operation
  @RegisterSwagger.body
  @RegisterSwagger.responses.success
  @RegisterSwagger.responses.badRequest
  async register(@Body() registerDto: RegisterDto) {
    await this.usersService.create(registerDto);
    return {
      message:
        'User registered successfully. Please check your email to verify your account.',
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginSwagger.operation
  @LoginSwagger.body
  @LoginSwagger.responses.success
  @LoginSwagger.responses.unauthorized
  async login(
    @Body() loginDto: LoginDto,
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
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
