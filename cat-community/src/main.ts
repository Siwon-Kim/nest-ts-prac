import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // NestExpressApplication: express를 사용하기 위해 NestApplication을 확장한 것
  app.useGlobalPipes(new ValidationPipe()); // global pipe (class validation)
  app.useGlobalFilters(new HttpExceptionFilter()); // global filter

  // swagger
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // static files
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/static',
  });

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
