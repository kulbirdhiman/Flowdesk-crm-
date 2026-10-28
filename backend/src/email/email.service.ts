import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}

  async sendPasswordReset(email: string, token: string) {
    const host = this.config.get<string>('SMTP_HOST');
    if (!host)
      throw new ServiceUnavailableException(
        'Password reset email is not configured',
      );
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 1025);
    const user = this.config.get<string>('SMTP_USER');
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      ...(user
        ? {
            auth: {
              user,
              pass: this.config.getOrThrow<string>('SMTP_PASSWORD'),
            },
          }
        : {}),
    });
    const link = new URL(
      '/reset-password',
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000',
    );
    link.searchParams.set('token', token);
    await transporter.sendMail({
      from: this.config.get<string>('SMTP_FROM') ?? 'CRM <noreply@crm.local>',
      to: email,
      subject: 'Reset your CRM password',
      text: `Reset your password using this link: ${link.toString()}\nThis link expires in one hour. If you did not request it, ignore this email.`,
    });
  }
}
