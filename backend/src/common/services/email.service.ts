import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    // Em produção, isso integraria com SendGrid, AWS SES ou Mailgun.
    // Para homologação, logamos o envio de e-mail de forma detalhada e segura.
    this.logger.log(`📧 [E-mail Transacional Enviado] Para: ${to} | Assunto: "${subject}"`);
    return true;
  }

  async sendWelcomeEmail(to: string, userName: string, companyName: string): Promise<boolean> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h1 style="color: #3b82f6; font-size: 24px;">Bem-vindo ao ConnectMax CRM IA, ${userName}!</h1>
        <p style="color: #94a3b8; font-size: 14px;">Seu ambiente multi-tenant isolado para a empresa <strong>${companyName}</strong> foi provisionado com segurança.</p>
        <p style="color: #94a3b8; font-size: 14px;">Agora você já pode conectar seu WhatsApp e utilizar nossa Inteligência Artificial para alavancar suas vendas.</p>
        <a href="https://connectmaxcrm.com/login" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">Acessar Meu Painel</a>
      </div>
    `;
    return this.sendEmail(to, 'Bem-vindo ao ConnectMax CRM IA! 🚀', html);
  }

  async sendRegistrationConfirmation(to: string, userName: string): Promise<boolean> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h1 style="color: #3b82f6; font-size: 20px;">Confirmação de Cadastro</h1>
        <p style="color: #94a3b8; font-size: 14px;">Olá ${userName}, seu cadastro no ConnectMax CRM IA foi efetuado com sucesso.</p>
        <p style="color: #94a3b8; font-size: 14px;">Seu e-mail está confirmado e pronto para uso.</p>
      </div>
    `;
    return this.sendEmail(to, 'Confirmação de Cadastro - ConnectMax CRM IA', html);
  }

  async sendPasswordReset(to: string, userName: string, resetLink: string): Promise<boolean> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h1 style="color: #3b82f6; font-size: 20px;">Recuperação de Senha</h1>
        <p style="color: #94a3b8; font-size: 14px;">Olá ${userName}, recebemos uma solicitação de redefinição de senha para sua conta.</p>
        <p style="color: #94a3b8; font-size: 14px;">Clique no link abaixo para cadastrar uma nova senha (válido por 1 hora):</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">Redefinir Minha Senha</a>
      </div>
    `;
    return this.sendEmail(to, 'Redefinição de Senha - ConnectMax CRM IA', html);
  }

  async sendTrialStarted(to: string, companyName: string, endDate: Date): Promise<boolean> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h1 style="color: #10b981; font-size: 20px;">Período de Trial de 14 Dias Iniciado! 🎉</h1>
        <p style="color: #94a3b8; font-size: 14px;">Seu período experimental gratuito para a empresa <strong>${companyName}</strong> está ativo.</p>
        <p style="color: #94a3b8; font-size: 14px;">O teste expira em: <strong>${endDate.toLocaleDateString('pt-BR')}</strong>.</p>
      </div>
    `;
    return this.sendEmail(to, 'Seu Trial de 14 Dias Começou! - ConnectMax CRM IA', html);
  }

  async sendTrialExpiring(to: string, companyName: string, daysLeft: number): Promise<boolean> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h1 style="color: #f59e0b; font-size: 20px;">Aviso: Seu Período Experimental Está Expirando! ⚠️</h1>
        <p style="color: #94a3b8; font-size: 14px;">Restam apenas <strong>${daysLeft} dias</strong> de teste gratuito para a empresa <strong>${companyName}</strong>.</p>
        <p style="color: #94a3b8; font-size: 14px;">Assine um plano comercial no menu Faturamento para evitar a expiração e interrupção dos robôs de IA.</p>
        <a href="https://connectmaxcrm.com/billing" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">Assinar Plano</a>
      </div>
    `;
    return this.sendEmail(to, 'Aviso de Expiração do Período de Trial! ⚠️', html);
  }

  async sendPaymentConfirmed(to: string, companyName: string, planName: string, value: number): Promise<boolean> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h1 style="color: #10b981; font-size: 20px;">Pagamento Confirmado! 💳</h1>
        <p style="color: #94a3b8; font-size: 14px;">Identificamos a confirmação de faturamento para a empresa <strong>${companyName}</strong>.</p>
        <p style="color: #94a3b8; font-size: 14px;">Plano: <strong>${planName}</strong> | Valor: <strong>R$ ${value.toFixed(2)}</strong>.</p>
        <p style="color: #94a3b8; font-size: 14px;">Obrigado por assinar o ConnectMax CRM IA!</p>
      </div>
    `;
    return this.sendEmail(to, 'Pagamento Confirmado! 💳 - ConnectMax CRM IA', html);
  }
}
