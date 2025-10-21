import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { leadSchema } from '@/lib/validators';

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  const lead = await prisma.lead.findFirst({ where: { id: params.id, userId: user.id } });
  if (!lead) {
    return NextResponse.json({ message: 'Lead não encontrado' }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    const existing = await prisma.lead.findFirst({ where: { id: params.id, userId: user.id } });
    if (!existing) {
      return NextResponse.json({ message: 'Lead não encontrado' }, { status: 404 });
    }

    const data = await request.json();
    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, company, email, phone, value, notes, stageId, position } = parsed.data;

    if (stageId) {
      const stage = await prisma.leadStage.findFirst({ where: { id: stageId, userId: user.id } });
      if (!stage) {
        return NextResponse.json({ message: 'Estágio inválido' }, { status: 400 });
      }
    }

    const dataToUpdate: Prisma.LeadUpdateInput = {
      name,
      company: company || null,
      email: email || null,
      phone: phone || null,
      notes: notes || null,
      stage: stageId ? { connect: { id: stageId } } : undefined
    };

    if (value !== undefined) {
      dataToUpdate.value = new Prisma.Decimal(value);
    }

    if (position !== undefined) {
      dataToUpdate.position = position;
    }

    if (!stageId) {
      dataToUpdate.stage = existing.stageId ? { connect: { id: existing.stageId } } : undefined;
    }

    const updated = await prisma.lead.update({
      where: { id: params.id },
      data: dataToUpdate,
      include: { stage: true }
    });

    return NextResponse.json({ lead: updated });
  } catch (error) {
    console.error('Update lead error', error);
    return NextResponse.json({ message: 'Erro ao atualizar lead' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
  }

  try {
    const existing = await prisma.lead.findFirst({ where: { id: params.id, userId: user.id } });
    if (!existing) {
      return NextResponse.json({ message: 'Lead não encontrado' }, { status: 404 });
    }

    await prisma.lead.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete lead error', error);
    return NextResponse.json({ message: 'Erro ao excluir lead' }, { status: 500 });
  }
}
