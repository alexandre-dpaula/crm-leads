import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail({
  to,
  token
}: {
  to: string;
  token: string;
}) {
  if (!process.env.EMAIL_FROM || !process.env.EMAIL_TRANSPORT_URL || !process.env.APP_BASE_URL) {
    console.warn('Configuração de e-mail ausente. E-mail de reset não será enviado.');
    return;
  }

  const transporter = nodemailer.createTransport(process.env.EMAIL_TRANSPORT_URL);

  const resetUrl = `${process.env.APP_BASE_URL}/reset-password/${token}`;

  await transporter.sendMail({
    to,
    from: process.env.EMAIL_FROM,
    subject: 'Reset de senha - FlowCRM',
    html: `
      <p>Você solicitou a alteração de senha do FlowCRM.</p>
      <p>Clique no link abaixo para definir uma nova senha. O link expira em 60 minutos.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Se você não solicitou, ignore este e-mail.</p>
    `
  });
}
