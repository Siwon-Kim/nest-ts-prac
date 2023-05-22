import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // global pipe (class validation)
  app.useGlobalFilters(new HttpExceptionFilter()); // global filter
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`localhost:${port} is running!`);
}
bootstrap();
