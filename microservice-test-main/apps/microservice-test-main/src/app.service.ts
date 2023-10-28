import { LibService } from '@app/lib';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @Inject(LibService)
  private lib: LibService;

  getHello(): string {
    return 'MicroService: Hello World!';
  }

  echo(data: any) {
    return {
      data,
      origin: 'MicroService',
    };
  }

  echoOnly(data: any) {
    console.info(data);
    this.lib.log(data);
  }
}
