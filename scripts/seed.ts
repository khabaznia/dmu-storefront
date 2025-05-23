import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash('password', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminPassword },
    create: {
      username: 'admin',
      password: adminPassword,
    },
  });
  console.log('Admin user created');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect()); 