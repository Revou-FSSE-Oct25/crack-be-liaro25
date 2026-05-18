import { NotFoundException } from '@nestjs/common';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

const { MenusService } = require('./menus.service');

describe('MenusService', () => {
  let service: any;

  const prismaMock = {
    menuItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    menuPackage: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MenusService(prismaMock as any);
  });

  it('creates menu item with trimmed data', async () => {
    const item = { id: 'item-1', name: 'Scone' };
    prismaMock.menuItem.create.mockResolvedValue(item);

    const result = await service.createMenuItem({
      name: ' Scone ',
      category: ' Sweet ',
      price: 45000,
      description: ' Fresh ',
      imageUrl: ' image.webp ',
    });

    expect(prismaMock.menuItem.create).toHaveBeenCalledWith({
      data: {
        name: 'Scone',
        category: 'Sweet',
        price: 45000,
        description: 'Fresh',
        imageUrl: 'image.webp',
      },
    });
    expect(result).toEqual(item);
  });

  it('finds all menu items with filters', async () => {
    prismaMock.menuItem.findMany.mockResolvedValue([]);

    await service.findAllMenuItems({
      search: 'tea',
      category: 'beverage',
      minPrice: 10000,
      maxPrice: 50000,
    });

    expect(prismaMock.menuItem.findMany).toHaveBeenCalledWith({
      where: {
        AND: expect.any(Array),
      },
      orderBy: {
        name: 'asc',
      },
    });
  });

  it('finds one menu item', async () => {
    const item = { id: 'item-1', name: 'Scone' };
    prismaMock.menuItem.findUnique.mockResolvedValue(item);

    const result = await service.findOneMenuItem('item-1');

    expect(result).toEqual(item);
  });

  it('throws NotFoundException when menu item is not found', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(null);

    await expect(service.findOneMenuItem('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates menu item', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue({ id: 'item-1' });
    prismaMock.menuItem.update.mockResolvedValue({ id: 'item-1', name: 'Tea' });

    const result = await service.updateMenuItem('item-1', {
      name: ' Tea ',
      category: ' Beverage ',
      price: 35000,
      status: 'available',
    });

    expect(prismaMock.menuItem.update).toHaveBeenCalled();
    expect(result.name).toBe('Tea');
  });

  it('soft deletes menu item by setting status unavailable', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue({ id: 'item-1' });
    prismaMock.menuItem.update.mockResolvedValue({
      id: 'item-1',
      status: 'unavailable',
    });

    const result = await service.removeMenuItem('item-1');

    expect(prismaMock.menuItem.update).toHaveBeenCalledWith({
      where: { id: 'item-1' },
      data: { status: 'unavailable' },
    });
    expect(result.status).toBe('unavailable');
  });

  it('creates menu package', async () => {
    const menuPackage = { id: 'package-1', name: 'Western Package' };
    prismaMock.menuPackage.create.mockResolvedValue(menuPackage);

    const result = await service.createMenuPackage({
      name: ' Western Package ',
      price: 300000,
      description: ' Luxury set ',
      imageUrl: ' package.webp ',
    });

    expect(result).toEqual(menuPackage);
  });

  it('finds all menu packages', async () => {
    prismaMock.menuPackage.findMany.mockResolvedValue([]);

    await service.findAllMenuPackages();

    expect(prismaMock.menuPackage.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });

  it('throws NotFoundException when menu package is not found', async () => {
    prismaMock.menuPackage.findUnique.mockResolvedValue(null);

    await expect(service.findOneMenuPackage('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates menu package', async () => {
    prismaMock.menuPackage.findUnique.mockResolvedValue({ id: 'package-1' });
    prismaMock.menuPackage.update.mockResolvedValue({
      id: 'package-1',
      name: 'Traditional Package',
    });

    const result = await service.updateMenuPackage('package-1', {
      name: ' Traditional Package ',
      price: 250000,
      status: 'available',
    });

    expect(prismaMock.menuPackage.update).toHaveBeenCalled();
    expect(result.name).toBe('Traditional Package');
  });

  it('soft deletes menu package by setting status unavailable', async () => {
    prismaMock.menuPackage.findUnique.mockResolvedValue({ id: 'package-1' });
    prismaMock.menuPackage.update.mockResolvedValue({
      id: 'package-1',
      status: 'unavailable',
    });

    const result = await service.removeMenuPackage('package-1');

    expect(prismaMock.menuPackage.update).toHaveBeenCalledWith({
      where: { id: 'package-1' },
      data: { status: 'unavailable' },
    });
    expect(result.status).toBe('unavailable');
  });
});
