import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { stageUpdateSchema } from '@/lib/validators';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  const stages = await prisma.leadStage.findMany({ where: { userId: user.id }, orderBy: { order: 'asc' } });
  return NextResponse.json({ stages });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const schema = z.array(stageUpdateSchema);
    const parsed = schema.safeParse(data?.stages ?? data);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const updates = parsed.data;

    await prisma.$transaction(
      updates.map((stage) =>
        prisma.leadStage.updateMany({
          where: { id: stage.id, userId: user.id },
          data: {
            name: stage.name,
            order: stage.order
          }
        })
      )
    );

    const stages = await prisma.leadStage.findMany({ where: { userId: user.id }, orderBy: { order: 'asc' } });
    return NextResponse.json({ stages });
  } catch (error) {
    console.error('Stage update error', error);
    return NextResponse.json({ message: 'Erro ao atualizar estágios' }, { status: 500 });
  }
}
