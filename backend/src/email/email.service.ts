import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { EmailDto } from './dto/email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private configService: ConfigService;
  private transporter: {
    gmail: Transporter;
    qq: Transporter;
  };

  constructor(configService: ConfigService) {
    this.configService = configService;
    this.transporter = {
      gmail: createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'Oauth2',
          user: this.configService.get('gmail_from'),
          clientId: this.configService.get('gmail_client_id'),
          clientSecret: this.configService.get('gmail_client_secret'),
          refreshToken: this.configService.get('gmail_refresh_token'),
          accessToken: this.configService.get('gmail_access_token'),
        },
      }),
      qq: createTransport({
        host: 'smtp.qq.com',
        port: 587,
        secure: false,
        auth: {
          user: this.configService.get('qq_from'),
          pass: this.configService.get('qq_pass'),
        },
      }),
    };
  }

  send(email: EmailDto) {
    if (email.attachments) {
      email.attachments = JSON.parse(email.attachments as unknown as string);
    }
    const transporter: Transporter =
      this.transporter[email.emailType] || this.transporter.qq;
    return transporter.sendMail(email);
  }
}
