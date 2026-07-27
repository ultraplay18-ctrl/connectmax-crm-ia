import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers com Helmet (permitindo cross-origin recursos)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS dinâmico para Frontend (Vercel + Localhost + FRONTEND_URL env)
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const frontendEnv = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
      const allowedOrigins = [
        frontendEnv,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ].filter(Boolean);

      const isVercel = /\.vercel\.app$/.test(origin);
      const isAllowed = allowedOrigins.includes(origin) || isVercel;

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-tenant-id',
  });

  // Middleware for cookies
  app.use(cookieParser());

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend ConnectMax CRM IA rodando em: http://localhost:${port}/api/v1`);
}

bootstrap();
