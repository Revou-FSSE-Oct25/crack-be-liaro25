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

jest.mock('./users.service', () => ({
  UsersService: jest.fn(),
}));

const { UsersController } = require('./users.controller');

describe('UsersController', () => {
  let controller: any;

  const usersServiceMock = {
    findAll: jest.fn(),
    findProfile: jest.fn(),
    updateProfile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UsersController(usersServiceMock);
  });

  it('finds all users', async () => {
    usersServiceMock.findAll.mockResolvedValue([{ id: 'user-1' }]);

    const result = await controller.findAll();

    expect(usersServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual([{ id: 'user-1' }]);
  });

  it('updates profile', async () => {
    usersServiceMock.updateProfile.mockResolvedValue({
      id: 'user-1',
      name: 'Updated Lia',
    });

    const result = await controller.updateProfile(
      { user: { userId: 'user-1' } },
      { name: 'Updated Lia' },
    );

    expect(usersServiceMock.updateProfile).toHaveBeenCalledWith('user-1', {
      name: 'Updated Lia',
    });
    expect(result.name).toBe('Updated Lia');
  });
});
