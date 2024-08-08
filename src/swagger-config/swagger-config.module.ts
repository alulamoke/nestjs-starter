import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerConfigModule {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('YegnaCinema API')
      .setDescription(
        `
      **YegnaCinema** is an online platform that allows users to book cinema tickets conveniently. 
      
      With YegnaCinema, you can browse movie listings, select showtimes, and purchase tickets from the comfort of your home or on the go. 
      Enjoy the latest movies in theaters across Ethiopia without the hassle of long queues.
      
      ### Features:
      - Browse and search for movies currently playing in theaters.
      - View detailed information about each movie, including synopsis, cast, and ratings.
      - Check showtimes and availability for multiple cinemas.
      - Book and purchase tickets securely.
      - Receive digital tickets via email or SMS.
      
      Whether you're planning a movie night with friends or a special date, YegnaCinema makes it easy to enjoy the cinema experience.
    `,
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
      jsonDocumentUrl: 'swagger/json',
    });
  }
}
