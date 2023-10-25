import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Email Module')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  test(@Body() email: EmailDto) {
    return this.emailService.send(email);
  }
}
