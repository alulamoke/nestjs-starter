import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { ConfigModule } from 'src/config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [ConfigModule, JwtModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
