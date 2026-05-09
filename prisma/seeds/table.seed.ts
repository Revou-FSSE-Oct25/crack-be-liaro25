import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';

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

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@whiskandwonder.com',
    },
    update: {
      role: Role.ADMIN,
    },
    create: {
      name: 'Admin Whisk & Wonder',
      email: 'admin@whiskandwonder.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const menuItems = [
    {
      name: 'Classic Scone',
      category: 'Sweet',
      price: 35000,
    },
    {
      name: 'Strawberry Tart',
      category: 'Sweet',
      price: 45000,
    },
    {
      name: 'Smoked Salmon Sandwich',
      category: 'Savory',
      price: 65000,
    },
    {
      name: 'Truffle Egg Sandwich',
      category: 'Savory',
      price: 55000,
    },
    {
      name: 'Matcha Latte',
      category: 'Drink',
      price: 40000,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }

  await prisma.menuPackage.create({
    data: {
      name: 'Classic Afternoon Tea Set',
      price: 180000,
    },
  });

  await prisma.menuPackage.create({
    data: {
      name: 'Premium Afternoon Tea Set',
      price: 280000,
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
