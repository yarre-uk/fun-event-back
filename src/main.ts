import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('FunEvent')
    .setDescription('The FunEvent API description')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:3000', // Set to the specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all HTTP methods
    credentials: true, // This allows cookies to be sent
  });

  await app.listen(3005);
}
bootstrap();
