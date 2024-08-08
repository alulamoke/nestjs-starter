import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dest: configService.get('LOCAL_FILE_UPLOAD_DEST'),
      }),
    }),
  ],
  exports: [MulterModule],
})
export class FileUploadModule {}
