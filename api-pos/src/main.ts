import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: ['http://localhost:5173'], // ganti dengan origin Vue kamu
    origin: true, // ganti dengan origin Vue kamu
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // kalau pakai cookie atau auth header
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        // Ubah error class-validator jadi object per field
        const formattedErrors = {};
        errors.forEach((err) => {
          formattedErrors[err.property] = Object.values(err.constraints);
        });
        return new BadRequestException({
          statusCode: 400,
          message: formattedErrors,
          error: 'Bad Request',
        });
      },
    }),
  );
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'unsafe-none' },
      crossOriginEmbedderPolicy: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  // console.log(`App running on: ${await app.getUrl()}`);
}

bootstrap();
