jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: class {},
  Role: {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
  },
}));

jest.mock('./tables.service', () => ({
  TablesService: jest.fn(),
}));

const { TablesController } = require('./tables.controller');

describe('TablesController', () => {
  let controller: any;

  const tablesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new TablesController(tablesServiceMock);
  });

  it('creates table', async () => {
    tablesServiceMock.create.mockResolvedValue({ id: 'table-1' });

    const result = await controller.create({
      name: 'T1',
      capacity: 4,
    });

    expect(tablesServiceMock.create).toHaveBeenCalledWith({
      name: 'T1',
      capacity: 4,
    });
    expect(result.id).toBe('table-1');
  });

  it('finds all tables', async () => {
    tablesServiceMock.findAll.mockResolvedValue([{ id: 'table-1' }]);

    const result = await controller.findAll();

    expect(result).toEqual([{ id: 'table-1' }]);
  });

  it('finds one table', async () => {
    tablesServiceMock.findOne.mockResolvedValue({ id: 'table-1' });

    const result = await controller.findOne('table-1');

    expect(tablesServiceMock.findOne).toHaveBeenCalledWith('table-1');
    expect(result.id).toBe('table-1');
  });

  it('updates table', async () => {
    tablesServiceMock.update.mockResolvedValue({
      id: 'table-1',
      capacity: 6,
    });

    const result = await controller.update('table-1', {
      capacity: 6,
    });

    expect(tablesServiceMock.update).toHaveBeenCalledWith('table-1', {
      capacity: 6,
    });
    expect(result.capacity).toBe(6);
  });

  it('removes table', async () => {
    tablesServiceMock.remove.mockResolvedValue({
      id: 'table-1',
      status: 'unavailable',
    });

    const result = await controller.remove('table-1');

    expect(tablesServiceMock.remove).toHaveBeenCalledWith('table-1');
    expect(result.status).toBe('unavailable');
  });
});
