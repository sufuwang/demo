import { Controller, Get } from '@nestjs/common';
import { GRpcService } from './g-rpc.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class GRpcController {
  constructor(private readonly gRpcService: GRpcService) {}

  @Get()
  getHello(): string {
    return this.gRpcService.getHello();
  }

  @GrpcMethod('BookService', 'FindBook')
  findBook(data: { id: number }) {
    const items = [
      { id: 1, name: '前端调试通关秘籍', desc: '网页和 node 调试' },
      { id: 2, name: 'Nest 通关秘籍', desc: 'Nest 和各种后端中间件' },
    ];
    return items.find(({ id }) => id === data.id) ?? {};
  }
}
