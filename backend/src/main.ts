import 'dotenv/config';
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
  const configuredOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
    : [];

  const defaultOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (curl, Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      const allowedOrigins = [...defaultOrigins, ...configuredOrigins];
      if (
        allowedOrigins.includes(origin) ||
        process.env.FRONTEND_URL === '*' ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`RIASEC Backend đang chạy tại: http://localhost:${port}/api`);
}
bootstrap();
