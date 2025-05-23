import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const officials = await prisma.official.findMany();
    return NextResponse.json(officials);
  } catch (error) {
    console.error('GET /api/officials error:', error);
    return NextResponse.json({ error: 'Failed to fetch officials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const official = await prisma.official.create({ data });
    return NextResponse.json(official, { status: 201 });
  } catch (error) {
    let body = '';
    try { body = JSON.stringify(await req.json()); } catch {}
    console.error('POST /api/officials error:', error, 'Body:', body);
    return NextResponse.json({ error: 'Failed to create official' }, { status: 500 });
  }
} 