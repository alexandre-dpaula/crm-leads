import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validators';
import { setAuthCookie, signAuthToken, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = signAuthToken(user.id);
    setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ message: 'Erro ao autenticar' }, { status: 500 });
  }
}
