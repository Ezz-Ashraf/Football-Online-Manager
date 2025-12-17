import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { appConfig } from './config/config';
import { BullBoardModule } from './bull-board/bull-board.module';
import { BullBoardService } from './bull-board/bull-board.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger
  const config = new DocumentBuilder()
     .setTitle('Football Manager API')
  .setVersion('1.0')
  .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const bullBoardService = app.get(BullBoardService);
  bullBoardService.setup(app);

  await app.listen(appConfig.app.port ?? 3000);
}
bootstrap();
