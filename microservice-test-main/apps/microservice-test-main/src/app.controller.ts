import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('')
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('echo')
  echo(data: any) {
    return this.appService.echo(data);
  }

  @EventPattern('echo.only')
  echoOnly(data: any) {
    return this.appService.echoOnly(data);
  }
}
