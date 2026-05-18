import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('../../generated/prisma/client', () => ({
  PaymentStatus: {
    paid: 'paid',
    failed: 'failed',
    refunded: 'refunded',
  },
  PaymentType: {
    full_payment: 'full_payment',
    deposit: 'deposit',
  },
  PaymentMethod: {
    cash: 'cash',
    bank_transfer: 'bank_transfer',
    credit_card: 'credit_card',
    e_wallet: 'e_wallet',
  },
}));

const { PaymentsService } = require('./payments.service');

describe('PaymentsService', () => {
  let service: any;

  const prismaMock = {
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    reservation: {
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PaymentsService(prismaMock as any);
  });

  it('creates payment successfully', async () => {
    prismaMock.order.findUnique.mockResolvedValue({
      id: 'order-1',
      reservationId: 'reservation-1',
      totalAmount: 100000,
      payments: [],
    });

    prismaMock.payment.create.mockResolvedValue({
      id: 'payment-1',
      amount: 50000,
      status: 'paid',
    });

    await service.create({
      orderId: 'order-1',
      amount: 50000,
      paymentMethod: 'cash',
      paymentType: 'deposit',
    });

    expect(prismaMock.payment.create).toHaveBeenCalledWith({
      data: {
        orderId: 'order-1',
        amount: 50000,
        paymentType: 'deposit',
        paymentMethod: 'cash',
        status: 'paid',
      },
      include: {
        order: true,
      },
    });
  });

  it('confirms order and reservation when payment completes full amount', async () => {
    prismaMock.order.findUnique.mockResolvedValue({
      id: 'order-1',
      reservationId: 'reservation-1',
      totalAmount: 100000,
      payments: [{ amount: 50000, status: 'paid' }],
    });

    prismaMock.payment.create.mockResolvedValue({
      id: 'payment-1',
      amount: 50000,
      status: 'paid',
    });

    await service.create({
      orderId: 'order-1',
      amount: 50000,
      paymentMethod: 'cash',
      paymentType: 'full_payment',
    });

    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'confirmed' },
    });

    expect(prismaMock.reservation.update).toHaveBeenCalledWith({
      where: { id: 'reservation-1' },
      data: { status: 'confirmed' },
    });
  });

  it('throws NotFoundException when order is missing', async () => {
    prismaMock.order.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        orderId: 'missing',
        amount: 50000,
        paymentMethod: 'cash',
        paymentType: 'deposit',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws BadRequestException when amount is zero', async () => {
    prismaMock.order.findUnique.mockResolvedValue({
      id: 'order-1',
      reservationId: 'reservation-1',
      totalAmount: 100000,
      payments: [],
    });

    await expect(
      service.create({
        orderId: 'order-1',
        amount: 0,
        paymentMethod: 'cash',
        paymentType: 'deposit',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws BadRequestException when payment exceeds remaining balance', async () => {
    prismaMock.order.findUnique.mockResolvedValue({
      id: 'order-1',
      reservationId: 'reservation-1',
      totalAmount: 100000,
      payments: [{ amount: 90000, status: 'paid' }],
    });

    await expect(
      service.create({
        orderId: 'order-1',
        amount: 20000,
        paymentMethod: 'cash',
        paymentType: 'deposit',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('finds all payments', async () => {
    prismaMock.payment.findMany.mockResolvedValue([{ id: 'payment-1' }]);

    const result = await service.findAll();

    expect(result).toEqual([{ id: 'payment-1' }]);
    expect(prismaMock.payment.findMany).toHaveBeenCalled();
  });

  it('finds one payment', async () => {
    prismaMock.payment.findUnique.mockResolvedValue({ id: 'payment-1' });

    const result = await service.findOne('payment-1');

    expect(result.id).toBe('payment-1');
  });

  it('throws NotFoundException when payment is missing', async () => {
    prismaMock.payment.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('refunds payment', async () => {
    prismaMock.payment.findUnique.mockResolvedValue({ id: 'payment-1' });

    prismaMock.payment.update.mockResolvedValue({
      id: 'payment-1',
      status: 'refunded',
    });

    const result = await service.refund('payment-1');

    expect(result.status).toBe('refunded');
  });

  it('fails payment', async () => {
    prismaMock.payment.findUnique.mockResolvedValue({ id: 'payment-1' });

    prismaMock.payment.update.mockResolvedValue({
      id: 'payment-1',
      status: 'failed',
    });

    const result = await service.fail('payment-1');

    expect(result.status).toBe('failed');
  });

  it('finds my payments', async () => {
    prismaMock.payment.findMany.mockResolvedValue([{ id: 'payment-1' }]);

    const result = await service.findMyPayments('user-1');

    expect(result).toEqual([{ id: 'payment-1' }]);
    expect(prismaMock.payment.findMany).toHaveBeenCalledWith({
      where: {
        order: {
          reservation: {
            userId: 'user-1',
          },
        },
      },
      include: expect.any(Object),
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
});
