import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // global pipe (class validation)
  app.useGlobalFilters(new HttpExceptionFilter()); // global filter

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // cors
  app.enableCors({
    origin: true, // 모든 요청을 허용 (차후에 FE 주소로 변경)
    credentials: true,
  });

  const port = process.env.PORT;
  await app.listen(port);
  console.log(`localhost:${port} is running!`);
}
bootstrap();
