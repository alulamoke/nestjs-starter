import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async getAccessToken(user: User): Promise<string> {
    return this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      },
    );
  }

  async getRefreshToken(user: User): Promise<string> {
    return this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      },
    );
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.usersService.setRefreshToken(userId, refreshToken);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.usersService.clearRefreshToken(userId);
  }

  async verifyAccessToken(token: string): Promise<User | undefined> {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });

    const user = await this.usersService.findById(decoded.id);
    if (!user) {
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }
}
