jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

const { UsersService } = require('./users.service');

describe('UsersService', () => {
  let service: any;

  const prismaMock = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(prismaMock as any);
  });

  it('finds all users', async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: 'user-1' }]);

    const result = await service.findAll();

    expect(result).toEqual([{ id: 'user-1' }]);
    expect(prismaMock.user.findMany).toHaveBeenCalled();
  });

  it('updates profile with trimmed values', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user-1' });

    prismaMock.user.update.mockResolvedValue({
      id: 'user-1',
      name: 'Updated Lia',
      phone: '123',
      address: 'Tokyo',
    });

    const result = await service.updateProfile('user-1', {
      name: ' Updated Lia ',
      phone: ' 123 ',
      address: ' Tokyo ',
      dateOfBirth: '1990-01-01',
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalled();
    expect(result.name).toBe('Updated Lia');
  });

  it('updates profile without optional values', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'user-1' });

    prismaMock.user.update.mockResolvedValue({
      id: 'user-1',
      name: 'Lia',
    });

    const result = await service.updateProfile('user-1', {});

    expect(prismaMock.user.findUnique).toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalled();
    expect(result.id).toBe('user-1');
  });

  it('throws error when updating missing user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      service.updateProfile('missing-user', {
        name: 'Lia',
      }),
    ).rejects.toThrow('User not found');
  });
});
