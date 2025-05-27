import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const witnesses = await prisma.witness.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(witnesses);
  } catch (error) {
    return NextResponse.json({ error: 'Не вдалося отримати свідків' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const witness = await prisma.witness.create({ data });
    return NextResponse.json(witness);
  } catch (error) {
    return NextResponse.json({ error: 'Не вдалося створити свідка' }, { status: 500 });
  }
} 