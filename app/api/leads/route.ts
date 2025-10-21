import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { leadMoveSchema, leadSchema } from '@/lib/validators';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  const [leads, stages] = await Promise.all([
    prisma.lead.findMany({
      where: { userId: user.id },
      include: { stage: true },
      orderBy: [{ stage: { order: 'asc' } }, { position: 'asc' }, { createdAt: 'desc' }]
    }),
    prisma.leadStage.findMany({ where: { userId: user.id }, orderBy: { order: 'asc' } })
  ]);

  return NextResponse.json({ leads, stages });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const parsed = leadSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, company, email, phone, value, notes, stageId } = parsed.data;

    let stageToUse = stageId;
    let position = 0;
    if (stageToUse) {
      const stage = await prisma.leadStage.findFirst({ where: { id: stageToUse, userId: user.id } });
      if (!stage) {
        return NextResponse.json({ message: 'Estágio inválido' }, { status: 400 });
      }
    } else {
      const firstStage = await prisma.leadStage.findFirst({ where: { userId: user.id }, orderBy: { order: 'asc' } });
      stageToUse = firstStage?.id;
    }

    if (stageToUse) {
      const aggregate = await prisma.lead.aggregate({
        where: { userId: user.id, stageId: stageToUse },
        _max: { position: true }
      });
      position = (aggregate._max.position ?? 0) + 1;
    }

    const created = await prisma.lead.create({
      data: {
        name,
        company: company || null,
        email: email || null,
        phone: phone || null,
        value: value !== undefined ? new Prisma.Decimal(value) : undefined,
        notes: notes || null,
        stageId: stageToUse,
        userId: user.id,
        position
      }
    });

    const lead = await prisma.lead.findUnique({ where: { id: created.id }, include: { stage: true } });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Create lead error', error);
    return NextResponse.json({ message: 'Erro ao criar lead' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const parsed = z.array(leadMoveSchema).safeParse(data?.moves ?? data);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const moves = parsed.data;
    const stageIds = Array.from(new Set(moves.map((move) => move.stageId)));

    const validStages = await prisma.leadStage.findMany({ where: { userId: user.id, id: { in: stageIds } } });
    if (validStages.length !== stageIds.length) {
      return NextResponse.json({ message: 'Estágio inválido informado.' }, { status: 400 });
    }

    await prisma.$transaction(
      moves.map((move) =>
        prisma.lead.updateMany({
          where: { id: move.id, userId: user.id },
          data: { stageId: move.stageId, position: move.position }
        })
      )
    );

    const leads = await prisma.lead.findMany({
      where: { userId: user.id },
      include: { stage: true },
      orderBy: [{ stage: { order: 'asc' } }, { position: 'asc' }]
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Lead reorder error', error);
    return NextResponse.json({ message: 'Erro ao reordenar leads' }, { status: 500 });
  }
}
