import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ValidationFilter } from './common/filters/exceptions.filter';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new ValidationFilter());
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       scriptSrc: ["'self'"],
  //     },
  //   }),
  // );

  app.setGlobalPrefix('api/v1/');

  await app.listen(port);
  console.log(`Listening at http://localhost:${port}`);
  console.log(`ENV: ${process.env.NODE_ENV}`);
}
bootstrap();
