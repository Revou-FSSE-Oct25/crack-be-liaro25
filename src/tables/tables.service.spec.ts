import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

const { TablesService } = require('./tables.service');

describe('TablesService', () => {
  let service: any;

  const prismaMock = {
    table: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TablesService(prismaMock as any);
  });

  it('creates table successfully', async () => {
    prismaMock.table.findUnique.mockResolvedValue(null);

    prismaMock.table.create.mockResolvedValue({
      id: 'table-1',
      name: 'T1',
      capacity: 4,
    });

    const result = await service.create({
      name: ' T1 ',
      capacity: 4,
    });

    expect(prismaMock.table.create).toHaveBeenCalled();
    expect(result.name).toBe('T1');
  });

  it('throws BadRequestException when table already exists', async () => {
    prismaMock.table.findUnique.mockResolvedValue({
      id: 'table-1',
    });

    await expect(
      service.create({
        name: 'T1',
        capacity: 4,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('finds all tables', async () => {
    prismaMock.table.findMany.mockResolvedValue([{ id: 'table-1' }]);

    const result = await service.findAll();

    expect(result.length).toBe(1);
  });

  it('finds one table', async () => {
    prismaMock.table.findUnique.mockResolvedValue({
      id: 'table-1',
    });

    const result = await service.findOne('table-1');

    expect(result.id).toBe('table-1');
  });

  it('throws NotFoundException when table is missing', async () => {
    prismaMock.table.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates table', async () => {
    prismaMock.table.findUnique.mockResolvedValue({
      id: 'table-1',
    });

    prismaMock.table.update.mockResolvedValue({
      id: 'table-1',
      capacity: 6,
    });

    const result = await service.update('table-1', {
      capacity: 6,
    });

    expect(result.capacity).toBe(6);
  });

  it('removes table', async () => {
    prismaMock.table.findUnique.mockResolvedValue({
      id: 'table-1',
    });

    prismaMock.table.update.mockResolvedValue({
      id: 'table-1',
      status: 'unavailable',
    });

    const result = await service.remove('table-1');

    expect(result.status).toBe('unavailable');
  });
});
