import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import ENV from './constants/env';
import APP from './constants';

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
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Con-Tacto API')
    .setDescription('API de Con-Tacto')
    .setVersion('1.0')
    .addTag('con-tacto')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app as any, config);

  SwaggerModule.setup('api', app as any, documentFactory);

  Logger.log(`🚀 server is running on port http://localhost:${ENV.PORT}/api`);
  await app.listen(ENV.PORT);
}

void bootstrap();
