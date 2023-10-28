import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibModule } from '@app/lib';

@Module({
  imports: [LibModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
