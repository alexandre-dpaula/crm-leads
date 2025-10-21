import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { resetConfirmSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = resetConfirmSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Token inválido ou expirado' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } })
    ]);

    return NextResponse.json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    console.error('Reset confirm error', error);
    return NextResponse.json({ message: 'Erro ao resetar senha' }, { status: 500 });
  }
}
