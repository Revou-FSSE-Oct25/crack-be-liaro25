import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const tables = [
    { name: 'T1', capacity: 2 },
    { name: 'T2', capacity: 2 },
    { name: 'T3', capacity: 2 },
    { name: 'T4', capacity: 2 },
    { name: 'T5', capacity: 4 },
    { name: 'T6', capacity: 4 },
    { name: 'T7', capacity: 4 },
    { name: 'T8', capacity: 4 },
  ];

  for (const table of tables) {
    await prisma.table.upsert({
      where: { name: table.name },
      update: {},
      create: table,
    });
  }

  console.log('Tables seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });