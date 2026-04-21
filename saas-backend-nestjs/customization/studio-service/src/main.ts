import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@xerobookz/shared-common';
import { TransformInterceptor } from '@xerobookz/shared-common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('XeroBookz Studio Service')
    .setDescription('Customize your apps to your heart\'s content - No programming needed')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('apps')
    .addTag('models')
    .addTag('fields')
    .addTag('views')
    .addTag('workflows')
    .addTag('rules')
    .addTag('templates')
    .addTag('menus')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 9801;
  await app.listen(port);

  console.log(`🚀 Studio Service running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
