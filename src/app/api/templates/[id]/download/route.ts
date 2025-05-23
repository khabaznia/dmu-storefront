import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template || !template.docxTemplate) {
      return NextResponse.json({ error: 'Файл не знайдено' }, { status: 404 });
    }
    return new NextResponse(template.docxTemplate, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(template.name)}.docx"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Не вдалося завантажити файл' }, { status: 500 });
  }
} 