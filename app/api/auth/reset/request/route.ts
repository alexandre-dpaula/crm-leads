import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { resetRequestSchema } from '@/lib/validators';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = resetRequestSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt
        }
      });

      await sendPasswordResetEmail({ to: user.email, token });
    }

    return NextResponse.json({ message: 'Se existir uma conta com este e-mail, enviaremos instruções.' });
  } catch (error) {
    console.error('Reset request error', error);
    return NextResponse.json({ message: 'Erro ao processar solicitação' }, { status: 500 });
  }
}
