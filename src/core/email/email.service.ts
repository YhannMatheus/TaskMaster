import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { env } from '@/core/env';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor() {
    this.config = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE === 'true',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    };

    this.transporter = nodemailer.createTransport(this.config);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor de email conectado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar com servidor de email:', error);
      return false;
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"TaskMaster" <${this.config.auth.user}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html, // Usa o HTML diretamente como string
      });

      console.log('✅ Email enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  async render(jsx: React.JSX.Element): Promise<string> {
    try {
      const html = await render(jsx);
      return html;
    } catch (error) {
      console.error('❌ Erro ao renderizar template React:', error);
      throw error;
    }
  }
}

// Instância singleton do serviço de email
export const emailService = new EmailService();