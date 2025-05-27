import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest, context: any) {
  const { params } = context;
  try {
    const witness = await prisma.witness.findUnique({ where: { id: Number(params.id) } });
    if (!witness) return NextResponse.json({ error: 'Свідка не знайдено' }, { status: 404 });
    return NextResponse.json(witness);
  } catch (error) {
    return NextResponse.json({ error: 'Не вдалося отримати свідка' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  const { params } = context;
  try {
    const data = await req.json();
    const witness = await prisma.witness.update({ where: { id: Number(params.id) }, data });
    return NextResponse.json(witness);
  } catch (error) {
    return NextResponse.json({ error: 'Не вдалося оновити свідка' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: any) {
  const { params } = context;
  try {
    await prisma.witness.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Не вдалося видалити свідка' }, { status: 500 });
  }
} 