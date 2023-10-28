import { Injectable } from '@nestjs/common';

@Injectable()
export class LibService {
  log(data: any) {
    console.info('Lib: ', data);
  }
}
