import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { exec } from 'child_process';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ms')
  testMicroService() {
    return this.appService.testMicroService();
  }

  @Post('echo')
  testMicroServiceEcho(@Body() body: any) {
    return this.appService.testMicroServiceEcho(body);
  }

  @Post('echo.only')
  testMicroServiceEchoOnly(@Body() body: any) {
    return this.appService.testMicroServiceEchoOnly(body);
  }

  @Sse('stream')
  stream() {
    return new Observable((observer) => {
      const id = setInterval(() => {
        observer.next({ data: Date.now() });
      }, 1000);
      setTimeout(() => {
        clearInterval(id);
      }, 10000);
    });
  }

  @Sse('stream.log')
  streamLog() {
    const cp = exec('tail -f ./src/log');
    return new Observable((observer) => {
      cp.stdout.on('data', (msg) => {
        observer.next({ data: { msg: msg.toString() } });
      });
    });
  }

  @Get('book/:id')
  findBook(@Param('id') id: number) {
    return this.appService.findBook(id);
  }
}
