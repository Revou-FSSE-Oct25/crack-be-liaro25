import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { MenuStatus, PrismaClient, Role } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function upsertMenuItem(data: {
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}) {
  const existingItem = await prisma.menuItem.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existingItem) {
    return prisma.menuItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        ...data,
        status: MenuStatus.available,
      },
    });
  }

  return prisma.menuItem.create({
    data: {
      ...data,
      status: MenuStatus.available,
    },
  });
}

async function upsertMenuPackage(data: {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}) {
  const existingPackage = await prisma.menuPackage.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existingPackage) {
    return prisma.menuPackage.update({
      where: {
        id: existingPackage.id,
      },
      data: {
        ...data,
        status: MenuStatus.available,
      },
    });
  }

  return prisma.menuPackage.create({
    data: {
      ...data,
      status: MenuStatus.available,
    },
  });
}

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
      update: table,
      create: table,
    });
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@whiskandwonder.com',
    },
    update: {
      name: 'Admin Whisk & Wonder',
      role: Role.ADMIN,
    },
    create: {
      name: 'Admin Whisk & Wonder',
      email: 'admin@whiskandwonder.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.menuItem.updateMany({
    data: {
      status: MenuStatus.unavailable,
    },
  });

  await prisma.menuPackage.updateMany({
    data: {
      status: MenuStatus.unavailable,
    },
  });

  const menuItems = [
    {
      name: 'Mini Smoked Salmon Sandwich',
      category: 'Western Savory',
      price: 55000,
      description:
        'Delicate smoked salmon sandwich with creamy filling and elegant garnish.',
      imageUrl: '/images/menu/western-savory-platter.webp',
    },
    {
      name: 'Chicken Quiche',
      category: 'Western Savory',
      price: 60000,
      description:
        'Savory mini chicken quiche with a buttery crust and rich filling.',
      imageUrl: '/images/menu/western-savory-platter.webp',
    },
    {
      name: 'Truffle Egg Sandwich',
      category: 'Western Savory',
      price: 50000,
      description:
        'Soft egg sandwich with a refined truffle aroma and creamy texture.',
      imageUrl: '/images/menu/western-savory-platter.webp',
    },
    {
      name: 'Croissant Tuna Melt',
      category: 'Western Savory',
      price: 58000,
      description:
        'Buttery croissant filled with tuna melt and lightly toasted finish.',
      imageUrl: '/images/menu/western-savory-platter.webp',
    },
    {
      name: 'Classic Scone',
      category: 'Western Sweet',
      price: 45000,
      description:
        'Classic English-style scone served with cream and fruit preserve.',
      imageUrl: '/images/menu/western-sweet-platter.webp',
    },
    {
      name: 'Macaron Set',
      category: 'Western Sweet',
      price: 48000,
      description:
        'Colorful macarons with delicate shells and smooth cream filling.',
      imageUrl: '/images/menu/western-sweet-platter.webp',
    },
    {
      name: 'Strawberry Tart',
      category: 'Western Sweet',
      price: 52000,
      description:
        'Elegant strawberry tart with buttery crust and smooth custard.',
      imageUrl: '/images/menu/western-sweet-platter.webp',
    },
    {
      name: 'Red Velvet Slice',
      category: 'Western Sweet',
      price: 58000,
      description:
        'Soft red velvet cake slice with layered cream cheese frosting.',
      imageUrl: '/images/menu/western-sweet-platter.webp',
    },
    {
      name: 'Earl Grey Tea',
      category: 'Western Beverage',
      price: 35000,
      description:
        'Fragrant black tea with bergamot aroma, perfect for afternoon tea.',
      imageUrl: '/images/menu/western-beverage.webp',
    },
    {
      name: 'English Breakfast Tea',
      category: 'Western Beverage',
      price: 35000,
      description:
        'Classic bold black tea with a smooth and comforting finish.',
      imageUrl: '/images/menu/western-beverage.webp',
    },
    {
      name: 'Café Latte',
      category: 'Western Beverage',
      price: 42000,
      description: 'Smooth espresso with steamed milk and soft latte art.',
      imageUrl: '/images/menu/western-beverage.webp',
    },
    {
      name: 'Cappuccino',
      category: 'Western Beverage',
      price: 42000,
      description:
        'Rich espresso with creamy milk foam and a classic café finish.',
      imageUrl: '/images/menu/western-beverage.webp',
    },
    {
      name: 'Lemper Ayam',
      category: 'Traditional Savory',
      price: 32000,
      description:
        'Indonesian sticky rice roll filled with seasoned shredded chicken.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Risoles Ragout',
      category: 'Traditional Savory',
      price: 35000,
      description:
        'Classic Indonesian risoles filled with creamy chicken ragout.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Panada Tuna',
      category: 'Traditional Savory',
      price: 38000,
      description: 'Golden fried pastry filled with flavorful spiced tuna.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Pastel Kentang',
      category: 'Traditional Savory',
      price: 30000,
      description:
        'Crispy Indonesian pastel filled with potato and vegetables.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Mini Lontong Isi',
      category: 'Traditional Savory',
      price: 40000,
      description:
        'Mini rice cake filled with savory Indonesian-style filling.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Klepon',
      category: 'Traditional Sweet',
      price: 28000,
      description:
        'Pandan rice cake filled with palm sugar and coated in coconut.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Onde-onde',
      category: 'Traditional Sweet',
      price: 30000,
      description: 'Sesame-coated sweet rice ball with mung bean filling.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Dadar Gulung',
      category: 'Traditional Sweet',
      price: 32000,
      description:
        'Pandan crêpe roll filled with sweet coconut and palm sugar.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Kue Lapis',
      category: 'Traditional Sweet',
      price: 35000,
      description: 'Colorful Indonesian layered cake with soft chewy texture.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Putu Ayu',
      category: 'Traditional Sweet',
      price: 30000,
      description: 'Steamed pandan cake topped with grated coconut.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Seri Muka',
      category: 'Traditional Sweet',
      price: 35000,
      description: 'Layered glutinous rice and pandan custard dessert.',
      imageUrl: '/images/menu/traditional-platter.webp',
    },
    {
      name: 'Teh Melati',
      category: 'Traditional Beverage',
      price: 25000,
      description: 'Fragrant Indonesian jasmine tea with a light floral aroma.',
      imageUrl: '/images/menu/traditional-afternoon-tea.webp',
    },
    {
      name: 'Es Cendol',
      category: 'Traditional Beverage',
      price: 38000,
      description:
        'Refreshing Indonesian iced dessert drink with coconut milk and palm sugar.',
      imageUrl: '/images/menu/traditional-afternoon-tea.webp',
    },
    {
      name: 'Wedang Jahe',
      category: 'Traditional Beverage',
      price: 32000,
      description: 'Warm Indonesian ginger drink with comforting spice notes.',
      imageUrl: '/images/menu/traditional-afternoon-tea.webp',
    },
    {
      name: 'Lychee Tea',
      category: 'Traditional Beverage',
      price: 35000,
      description: 'Refreshing tea with sweet lychee flavor and fruity aroma.',
      imageUrl: '/images/menu/traditional-afternoon-tea.webp',
    },
  ];

  const createdItems = new Map<string, { id: string }>();

  for (const item of menuItems) {
    const menuItem = await upsertMenuItem(item);
    createdItems.set(menuItem.name, menuItem);
  }

  const westernPackage = await upsertMenuPackage({
    name: 'Western Afternoon Tea Set',
    price: 300000,
    description:
      'Premium Western afternoon tea package with savory bites, sweets, and Earl Grey tea.',
    imageUrl: '/images/menu/western-package.webp',
  });

  const traditionalPackage = await upsertMenuPackage({
    name: 'Nusantara Afternoon Tea Set',
    price: 250000,
    description:
      'Elegant Indonesian afternoon tea package featuring traditional savory snacks, sweets, and jasmine tea.',
    imageUrl: '/images/menu/traditional-package.webp',
  });

  await prisma.packageItem.deleteMany({
    where: {
      packageId: {
        in: [westernPackage.id, traditionalPackage.id],
      },
    },
  });

  const packageItems = [
    {
      packageId: westernPackage.id,
      menuItemName: 'Mini Smoked Salmon Sandwich',
      quantity: 1,
    },
    {
      packageId: westernPackage.id,
      menuItemName: 'Chicken Quiche',
      quantity: 1,
    },
    {
      packageId: westernPackage.id,
      menuItemName: 'Classic Scone',
      quantity: 1,
    },
    {
      packageId: westernPackage.id,
      menuItemName: 'Macaron Set',
      quantity: 1,
    },
    {
      packageId: westernPackage.id,
      menuItemName: 'Earl Grey Tea',
      quantity: 1,
    },
    {
      packageId: traditionalPackage.id,
      menuItemName: 'Lemper Ayam',
      quantity: 1,
    },
    {
      packageId: traditionalPackage.id,
      menuItemName: 'Risoles Ragout',
      quantity: 1,
    },
    {
      packageId: traditionalPackage.id,
      menuItemName: 'Klepon',
      quantity: 1,
    },
    {
      packageId: traditionalPackage.id,
      menuItemName: 'Kue Lapis',
      quantity: 1,
    },
    {
      packageId: traditionalPackage.id,
      menuItemName: 'Teh Melati',
      quantity: 1,
    },
  ];

  for (const item of packageItems) {
    const menuItem = createdItems.get(item.menuItemName);

    if (!menuItem) {
      throw new Error(`Menu item not found: ${item.menuItemName}`);
    }

    await prisma.packageItem.create({
      data: {
        packageId: item.packageId,
        menuItemId: menuItem.id,
        quantity: item.quantity,
      },
    });
  }

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
