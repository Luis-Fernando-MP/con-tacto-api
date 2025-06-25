import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import ENV from './constants/env';
import APP from './constants';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: APP.origins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Generar documento Swagger
  const config = new DocumentBuilder()
    .setTitle('Con-Tacto API')
    .setDescription('API de Con-Tacto')
    .setVersion('1.0')
    .addTag('con-tacto')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ⚠️ Sirve Swagger manualmente para evitar 404 en assets
  if (process.env.NODE_ENV !== 'production') {
    app.use('/api', swaggerUi.serve, swaggerUi.setup(document));
  }

  Logger.log(`🚀 server is running on http://localhost:${ENV.PORT}/api`);
  await app.listen(ENV.PORT);
}

void bootstrap();
