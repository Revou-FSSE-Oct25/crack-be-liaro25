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

jest.mock('./dashboard.service', () => ({
  DashboardService: jest.fn(),
}));

const { DashboardController } = require('./dashboard.controller');

describe('DashboardController', () => {
  let controller: any;

  const dashboardServiceMock = {
    getAdminSummary: jest.fn(),
    getCustomerSummary: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DashboardController(dashboardServiceMock);
  });

  it('gets admin summary', async () => {
    dashboardServiceMock.getAdminSummary.mockResolvedValue({
      totalReservations: 10,
    });

    const result = await controller.getAdminSummary();

    expect(dashboardServiceMock.getAdminSummary).toHaveBeenCalled();
    expect(result.totalReservations).toBe(10);
  });

  it('gets customer summary', async () => {
    dashboardServiceMock.getCustomerSummary.mockResolvedValue({
      totalReservations: 3,
    });

    const result = await controller.getCustomerSummary({
      user: { userId: 'user-1' },
    });

    expect(dashboardServiceMock.getCustomerSummary).toHaveBeenCalledWith(
      'user-1',
    );
    expect(result.totalReservations).toBe(3);
  });
});
