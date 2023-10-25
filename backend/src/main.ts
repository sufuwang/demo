import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { UnLoginFilter } from './unLogin.filter';
import { CustomFilter } from './custom.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new UnLoginFilter());
  app.useGlobalFilters(new CustomFilter());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Meeting Room System')
    .setDescription('API Document')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      description: 'JWT token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('service_port'));
}
bootstrap();
