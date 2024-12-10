import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerConfigModule {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('nestjs-starter API')
      .setDescription(
        `
      **nestjs-starter
    `,
      )
      .setVersion('1.0')
      .addServer('http://localhost:3000')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
      jsonDocumentUrl: 'swagger/json',
      yamlDocumentUrl: 'swagger/yaml',
    });
  }
}
