import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';

import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification]), ConfigModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
