import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middlewares
  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('nestjs-starter')
    .setDescription('nestjs-starter API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  // Start the app
  await app.listen(3000);
}

bootstrap();
