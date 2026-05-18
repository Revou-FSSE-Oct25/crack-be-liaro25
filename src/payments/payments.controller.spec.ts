jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: class {},
  Role: {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
  },
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

jest.mock('./payments.service', () => ({
  PaymentsService: jest.fn(),
}));

const { PaymentsController } = require('./payments.controller');

describe('PaymentsController', () => {
  let controller: any;

  const paymentsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findMyPayments: jest.fn(),
    findOne: jest.fn(),
    refund: jest.fn(),
    fail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new PaymentsController(paymentsServiceMock);
  });

  it('creates payment', async () => {
    paymentsServiceMock.create.mockResolvedValue({ id: 'payment-1' });

    const result = await controller.create({
      orderId: 'order-1',
      amount: 50000,
    });

    expect(paymentsServiceMock.create).toHaveBeenCalled();
    expect(result.id).toBe('payment-1');
  });

  it('finds all payments', async () => {
    paymentsServiceMock.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(result).toEqual([]);
  });

  it('finds my payments', async () => {
    paymentsServiceMock.findMyPayments.mockResolvedValue([]);

    const result = await controller.findMyPayments({
      user: { userId: 'user-1' },
    });

    expect(paymentsServiceMock.findMyPayments).toHaveBeenCalledWith('user-1');
    expect(result).toEqual([]);
  });

  it('finds one payment', async () => {
    paymentsServiceMock.findOne.mockResolvedValue({ id: 'payment-1' });

    const result = await controller.findOne('payment-1');

    expect(paymentsServiceMock.findOne).toHaveBeenCalledWith('payment-1');
    expect(result.id).toBe('payment-1');
  });

  it('refunds payment', async () => {
    paymentsServiceMock.refund.mockResolvedValue({
      status: 'refunded',
    });

    const result = await controller.refund('payment-1');

    expect(paymentsServiceMock.refund).toHaveBeenCalledWith('payment-1');
    expect(result.status).toBe('refunded');
  });

  it('fails payment', async () => {
    paymentsServiceMock.fail.mockResolvedValue({
      status: 'failed',
    });

    const result = await controller.fail('payment-1');

    expect(paymentsServiceMock.fail).toHaveBeenCalledWith('payment-1');
    expect(result.status).toBe('failed');
  });
});
