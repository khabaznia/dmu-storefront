import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  try {
    const official = await prisma.official.findUnique({ where: { id: Number(params.id) } });
    if (!official) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(official);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch official' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  const { params } = context;
  try {
    const data = await req.json();
    const official = await prisma.official.update({ where: { id: Number(params.id) }, data });
    return NextResponse.json(official);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update official' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const { params } = context;
  try {
    await prisma.official.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete official' }, { status: 500 });
  }
} 