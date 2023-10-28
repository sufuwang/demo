import { Injectable } from '@nestjs/common';

@Injectable()
export class GRpcService {
  getHello(): string {
    return 'Hello World!';
  }
}
