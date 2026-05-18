import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('../../generated/prisma/client', () => ({
  OrderStatus: {
    pending: 'pending',
    confirmed: 'confirmed',
    cancelled: 'cancelled',
    completed: 'completed',
  },
}));

const { OrdersService } = require('./orders.service');

describe('OrdersService', () => {
  let service: any;

  const prismaMock = {
    reservation: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    menuItem: {
      findUnique: jest.fn(),
    },
    menuPackage: {
      findUnique: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrdersService(prismaMock as any);
  });

  describe('create', () => {
    it('creates order with menu item and calculates tax', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: null,
      });

      prismaMock.menuItem.findUnique.mockResolvedValue({
        id: 'menu-1',
        price: 50000,
      });

      const createdOrder = {
        id: 'order-1',
        subtotal: 100000,
        tax: 10000,
        totalAmount: 110000,
      };

      prismaMock.order.create.mockResolvedValue(createdOrder);

      const result = await service.create({
        reservationId: 'reservation-1',
        items: [{ menuItemId: 'menu-1', quantity: 2 }],
      });

      expect(prismaMock.order.create).toHaveBeenCalledWith({
        data: {
          reservationId: 'reservation-1',
          subtotal: 100000,
          tax: 10000,
          totalAmount: 110000,
          items: {
            create: [
              {
                menuItemId: 'menu-1',
                quantity: 2,
                price: 50000,
              },
            ],
          },
        },
        include: expect.any(Object),
      });

      expect(result).toEqual(createdOrder);
    });

    it('creates order with menu package', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: null,
      });

      prismaMock.menuPackage.findUnique.mockResolvedValue({
        id: 'package-1',
        price: 300000,
      });

      prismaMock.order.create.mockResolvedValue({
        id: 'order-1',
        subtotal: 300000,
      });

      const result = await service.create({
        reservationId: 'reservation-1',
        items: [{ menuPackageId: 'package-1', quantity: 1 }],
      });

      expect(prismaMock.menuPackage.findUnique).toHaveBeenCalledWith({
        where: { id: 'package-1' },
      });

      expect(result.id).toBe('order-1');
    });

    it('throws NotFoundException when reservation is not found', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          reservationId: 'missing',
          items: [{ menuItemId: 'menu-1', quantity: 1 }],
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws BadRequestException when order already exists', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: { id: 'order-1' },
      });

      await expect(
        service.create({
          reservationId: 'reservation-1',
          items: [{ menuItemId: 'menu-1', quantity: 1 }],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws BadRequestException when items are empty', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: null,
      });

      await expect(
        service.create({
          reservationId: 'reservation-1',
          items: [],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws BadRequestException when item has no menu item or package', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: null,
      });

      await expect(
        service.create({
          reservationId: 'reservation-1',
          items: [{ quantity: 1 }],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws BadRequestException when item has both menu item and package', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: null,
      });

      await expect(
        service.create({
          reservationId: 'reservation-1',
          items: [
            {
              menuItemId: 'menu-1',
              menuPackageId: 'package-1',
              quantity: 1,
            },
          ],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws BadRequestException when quantity is zero', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: null,
      });

      await expect(
        service.create({
          reservationId: 'reservation-1',
          items: [{ menuItemId: 'menu-1', quantity: 0 }],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws NotFoundException when menu item is not found', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: null,
      });

      prismaMock.menuItem.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          reservationId: 'reservation-1',
          items: [{ menuItemId: 'missing-menu', quantity: 1 }],
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws NotFoundException when menu package is not found', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        order: null,
      });

      prismaMock.menuPackage.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          reservationId: 'reservation-1',
          items: [{ menuPackageId: 'missing-package', quantity: 1 }],
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  it('finds all orders', async () => {
    prismaMock.order.findMany.mockResolvedValue([{ id: 'order-1' }]);

    const result = await service.findAll();

    expect(prismaMock.order.findMany).toHaveBeenCalledWith({
      include: expect.any(Object),
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([{ id: 'order-1' }]);
  });

  it('finds one order', async () => {
    prismaMock.order.findUnique.mockResolvedValue({ id: 'order-1' });

    const result = await service.findOne('order-1');

    expect(result).toEqual({ id: 'order-1' });
  });

  it('throws NotFoundException when order is not found', async () => {
    prismaMock.order.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates order status', async () => {
    prismaMock.order.findUnique.mockResolvedValue({ id: 'order-1' });
    prismaMock.order.update.mockResolvedValue({
      id: 'order-1',
      status: 'confirmed',
    });

    const result = await service.updateStatus('order-1', 'confirmed');

    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'confirmed' },
    });
    expect(result.status).toBe('confirmed');
  });

  it('cancels order', async () => {
    prismaMock.order.findUnique.mockResolvedValue({ id: 'order-1' });
    prismaMock.order.update.mockResolvedValue({
      id: 'order-1',
      status: 'cancelled',
    });

    const result = await service.cancel('order-1');

    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'cancelled' },
    });
    expect(result.status).toBe('cancelled');
  });

  it('finds customer orders', async () => {
    prismaMock.order.findMany.mockResolvedValue([{ id: 'order-1' }]);

    const result = await service.findMyOrders('user-1');

    expect(prismaMock.order.findMany).toHaveBeenCalledWith({
      where: {
        reservation: {
          userId: 'user-1',
        },
      },
      include: expect.any(Object),
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toEqual([{ id: 'order-1' }]);
  });

  it('creates customer order when reservation belongs to user', async () => {
    prismaMock.reservation.findFirst.mockResolvedValue({
      id: 'reservation-1',
      userId: 'user-1',
    });

    prismaMock.reservation.findUnique.mockResolvedValue({
      id: 'reservation-1',
      order: null,
    });

    prismaMock.menuItem.findUnique.mockResolvedValue({
      id: 'menu-1',
      price: 50000,
    });

    prismaMock.order.create.mockResolvedValue({ id: 'order-1' });

    const result = await service.createMyOrder('user-1', {
      reservationId: 'reservation-1',
      items: [{ menuItemId: 'menu-1', quantity: 1 }],
    });

    expect(result).toEqual({ id: 'order-1' });
  });

  it('throws NotFoundException when customer reservation is not found', async () => {
    prismaMock.reservation.findFirst.mockResolvedValue(null);

    await expect(
      service.createMyOrder('user-1', {
        reservationId: 'missing',
        items: [{ menuItemId: 'menu-1', quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
