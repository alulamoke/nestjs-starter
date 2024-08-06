import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

import { ConfigService } from 'src/config/config.service';
import { RegisterDto } from 'src/auth/dto/register.dto';

import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
    private configService: ConfigService,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(body: RegisterDto): Promise<User> {
    const userExists = await this.findOneByEmail(body.email);
    if (userExists) {
      throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = this.usersRepository.create({
      ...body,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
    await this.sendVerificationEmail(user);

    return user;
  }

  async setRefreshToken(userId: string, refresh_token: string): Promise<void> {
    await this.usersRepository.update(userId, { refresh_token });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { refresh_token: null });
  }

  async sendVerificationEmail(user: User): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    const emailVerification = this.emailVerificationRepository.create({
      token,
      user,
    });
    await this.emailVerificationRepository.save(emailVerification);

    const transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: +this.configService.get('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
      secure: false,
    });

    const url = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${token}`;

    await transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: user.email,
      subject: 'Verify your email address',
      html: `Click <a href="${url}">here</a> to verify your email address.`,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const emailVerification = await this.emailVerificationRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!emailVerification) {
      throw new HttpException(
        'Invalid verification token.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = emailVerification.user;
    user.is_verified = true;
    await this.usersRepository.save(user);
    await this.emailVerificationRepository.delete(emailVerification.id);
  }
}
