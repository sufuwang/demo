import { Module } from '@nestjs/common';
import { GRpcController } from './g-rpc.controller';
import { GRpcService } from './g-rpc.service';

@Module({
  imports: [],
  controllers: [GRpcController],
  providers: [GRpcService],
})
export class GRpcModule {}
