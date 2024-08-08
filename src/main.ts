import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { SwaggerConfigModule } from './swagger-config/swagger-config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middlewares
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());

  // Swagger configuration
  SwaggerConfigModule.setup(app);

  // Start the app
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
