import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

interface BookService {
  findBook(param: { id: number }): {
    id: number;
    name: string;
    spec: string;
  };
}

@Injectable()
export class AppService {
  @Inject('Micro_Service')
  private msClient: ClientProxy;
  @Inject('Book_Package')
  private grpcClient: ClientGrpc;

  private bookService: BookService;

  getHello(): string {
    return 'Hello World!';
  }

  testMicroService() {
    return this.msClient.send('', '');
  }

  testMicroServiceEcho(data: any) {
    return this.msClient.send('echo', data);
  }

  // @Cron(CronExpression.EVERY_10_MINUTES, {
  //   name: 'cron-task',
  //   timeZone: 'Asia/shanghai',
  // })
  @Interval('cron-task', 1000)
  // @Timeout('cron-task', 10000)
  testMicroServiceEchoOnly(data: any = { a: 'A', date: Date.now() }) {
    return this.msClient.emit('echo.only', data);
  }

  onModuleInit() {
    this.bookService = this.grpcClient.getService('BookService');
  }
  findBook(id: number) {
    return this.bookService.findBook({ id });
  }
}
