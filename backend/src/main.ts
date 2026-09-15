import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Cấu hình tiền tố toàn cục /api
  app.setGlobalPrefix('api');

  // 2. Kích hoạt Validation tự động cho các DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 3. Cho phép CORS kết nối từ React Vite Frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`RIASEC Backend đang chạy tại: http://localhost:${port}/api`);
}
bootstrap();
