import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { profileSchema } from '@/lib/validators';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl
    }
  });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = profileSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, currentPassword, newPassword, avatarData } = parsed.data;

    if (email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== user.id) {
        return NextResponse.json({ message: 'E-mail já está em uso.' }, { status: 400 });
      }
    }

    let passwordHash: string | undefined;
    if (newPassword) {
      const isValidPassword = await verifyPassword(currentPassword ?? '', user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json({ message: 'Senha atual inválida.' }, { status: 400 });
      }
      passwordHash = await hashPassword(newPassword);
    }

    let avatarUrl = user.avatarUrl;
    if (avatarData) {
      const matches = avatarData.match(/^data:(image\/(?:png|jpeg|jpg));base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ message: 'Formato de avatar inválido.' }, { status: 400 });
      }
      const [, mimeType, base64Data] = matches;
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = mimeType === 'image/png' ? 'png' : 'jpg';
      const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
      await fs.mkdir(avatarsDir, { recursive: true });
      const filename = `${user.id}.${ext}`;
      await fs.writeFile(path.join(avatarsDir, filename), buffer);
      avatarUrl = `/avatars/${filename}`;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        avatarUrl,
        ...(passwordHash ? { passwordHash } : {})
      }
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatarUrl
      }
    });
  } catch (error) {
    console.error('Profile update error', error);
    return NextResponse.json({ message: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
