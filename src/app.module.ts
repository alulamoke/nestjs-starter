import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@/common/guards/auth.guard';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/database/database.module';
import { FileUploadModule } from '@/file-upload/file-upload.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/user.module';
import { SwaggerConfigModule } from '@/swagger-config/swagger-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    FileUploadModule,
    AuthModule,
    UsersModule,
    SwaggerConfigModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
