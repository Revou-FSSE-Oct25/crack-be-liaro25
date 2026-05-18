jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

const { DashboardService } = require('./dashboard.service');

describe('DashboardService', () => {
  let service: any;

  const prismaMock = {
    reservation: {
      count: jest.fn(),
    },
    order: {
      count: jest.fn(),
    },
    payment: {
      findMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DashboardService(prismaMock as any);
  });

  it('gets admin summary with calculated revenue', async () => {
    prismaMock.reservation.count
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);

    prismaMock.order.count.mockResolvedValue(15);

    prismaMock.payment.findMany.mockResolvedValue([
      { amount: 100000 },
      { amount: 250000 },
    ]);

    const result = await service.getAdminSummary();

    expect(result).toEqual({
      totalReservations: 20,
      pendingReservations: 5,
      confirmedReservations: 10,
      completedReservations: 3,
      cancelledReservations: 2,
      totalOrders: 15,
      totalRevenue: 350000,
    });
  });

  it('gets customer summary', async () => {
    prismaMock.reservation.count
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);

    const result = await service.getCustomerSummary('user-1');

    expect(result).toEqual({
      totalReservations: 12,
      upcomingReservations: 4,
      pendingReservations: 2,
      confirmedReservations: 5,
      completedReservations: 3,
      cancelledReservations: 2,
    });
  });

  it('returns zero revenue when there are no payments', async () => {
    prismaMock.reservation.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);

    prismaMock.order.count.mockResolvedValue(0);

    prismaMock.payment.findMany.mockResolvedValue([]);

    const result = await service.getAdminSummary();

    expect(result.totalRevenue).toBe(0);
  });
});
