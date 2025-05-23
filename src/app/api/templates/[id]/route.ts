import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) return NextResponse.json({ error: 'Шаблон не знайдено' }, { status: 404 });
    // docxTemplate не відправляємо тут
    const { docxTemplate, ...rest } = template;
    return NextResponse.json(rest);
  } catch (e) {
    return NextResponse.json({ error: 'Не вдалося отримати шаблон' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const properties = JSON.parse(formData.get('properties') as string) as string[];
    let updateData: any = { name, properties };
    const file = formData.get('docxTemplate') as File | null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      updateData.docxTemplate = Buffer.from(arrayBuffer);
    }
    const template = await prisma.template.update({ where: { id }, data: updateData });
    return NextResponse.json({ id: template.id, name: template.name, properties: template.properties });
  } catch (e) {
    return NextResponse.json({ error: 'Не вдалося оновити шаблон' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.template.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Не вдалося видалити шаблон' }, { status: 500 });
  }
} 