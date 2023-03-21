import { AllExceptionsFilter, TransformInterceptor } from '@app/common';
import { appConfig } from '@app/core';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());

  const options = new DocumentBuilder()
    .setTitle('G2K User API')
    .setDescription('G2K User API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const PORT = appConfig.server.PORT || 3000;
  const HOST = appConfig.server.HOST || 'localhost';

  if (process.env.NODE_ENV == 'development') {
    mongoose.set('debug', true);
  }

  await app.listen(PORT);

  console.log(`URL Swagger http://${HOST}:${PORT}/docs`);
  console.log(`Starting on http://${HOST}:${PORT}`);
}
bootstrap();
