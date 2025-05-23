import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const templates = await prisma.template.findMany();
    // docxTemplate не відправляємо (занадто великий), лише id, name, properties
    return NextResponse.json(templates.map(({ id, name, properties }) => ({ id, name, properties })));
  } catch (e) {
    return NextResponse.json({ error: 'Не вдалося отримати шаблони' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const properties = JSON.parse(formData.get('properties') as string) as string[];
    const file = formData.get('docxTemplate') as File;
    if (!name || !file) {
      return NextResponse.json({ error: 'Вкажіть назву та docx-файл' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const template = await prisma.template.create({
      data: {
        name,
        properties,
        docxTemplate: buffer,
      },
    });
    return NextResponse.json({ id: template.id, name: template.name, properties: template.properties });
  } catch (e) {
    return NextResponse.json({ error: 'Не вдалося створити шаблон' }, { status: 500 });
  }
} 