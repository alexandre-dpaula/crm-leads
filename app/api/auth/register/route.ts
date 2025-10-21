import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators';
import { hashPassword, setAuthCookie, signAuthToken } from '@/lib/auth';
import { defaultStages } from '@/utils/defaultStages';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'E-mail já cadastrado.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash
        }
      });

      await tx.leadStage.createMany({
        data: defaultStages.map((stage) => ({
          ...stage,
          userId: createdUser.id
        }))
      });

      return createdUser;
    });

    const token = signAuthToken(user.id);
    setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error', error);
    return NextResponse.json({ message: 'Erro ao registrar' }, { status: 500 });
  }
}
