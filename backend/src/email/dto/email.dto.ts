import { IsNotEmpty } from 'class-validator';

export class EmailDto {
  emailType: 'qq' | 'gmail';

  // 指定发送人
  from?: string;

  @IsNotEmpty({
    message: '收件人不能为空',
  })
  to: string;

  @IsNotEmpty({
    message: '邮件主题不能为空',
  })
  subject: string;

  // @IsNotEmpty({
  //   message: '邮件内容不能为空',
  // })
  // text: string;

  @IsNotEmpty({
    message: '邮件内容不能为空',
  })
  html: string;

  attachments?: Array<{
    filename?: string;
    content?: string;
    path?: string;
  }>;
}
