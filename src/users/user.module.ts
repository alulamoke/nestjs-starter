import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
