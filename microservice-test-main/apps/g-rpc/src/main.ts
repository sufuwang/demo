import { NestFactory } from '@nestjs/core';
import { GRpcModule } from './g-rpc.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(GRpcModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:8888',
      package: 'book',
      protoPath: join(__dirname, 'book/book.proto'),
    },
  });

  await app.listen();
}
bootstrap();
