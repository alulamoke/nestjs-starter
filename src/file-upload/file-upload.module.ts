import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

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
