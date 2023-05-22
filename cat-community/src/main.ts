import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); // global filter
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`localhost:${port} is running!`);
}
bootstrap();
