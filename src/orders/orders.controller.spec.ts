jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: class {},
  Role: {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
  },
  OrderStatus: {
    pending: 'pending',
    confirmed: 'confirmed',
    cancelled: 'cancelled',
    completed: 'completed',
  },
}));

jest.mock('./orders.service', () => ({
  OrdersService: jest.fn(),
}));

const { OrdersController } = require('./orders.controller');

describe('OrdersController', () => {
  let controller: any;

  const ordersServiceMock = {
    create: jest.fn(),
    createMyOrder: jest.fn(),
    findAll: jest.fn(),
    findMyOrders: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    cancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new OrdersController(ordersServiceMock);
  });

  it('creates order', async () => {
    ordersServiceMock.create.mockResolvedValue({ id: 'order-1' });

    const result = await controller.create({
      reservationId: 'reservation-1',
    });

    expect(ordersServiceMock.create).toHaveBeenCalled();
    expect(result.id).toBe('order-1');
  });

  it('creates my order', async () => {
    ordersServiceMock.createMyOrder.mockResolvedValue({ id: 'order-1' });

    const result = await controller.createMyOrder(
      { user: { userId: 'user-1' } },
      { reservationId: 'reservation-1' },
    );

    expect(ordersServiceMock.createMyOrder).toHaveBeenCalledWith('user-1', {
      reservationId: 'reservation-1',
    });
    expect(result.id).toBe('order-1');
  });

  it('finds all orders', async () => {
    ordersServiceMock.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(result).toEqual([]);
  });

  it('finds my orders', async () => {
    ordersServiceMock.findMyOrders.mockResolvedValue([]);

    const result = await controller.findMyOrders({
      user: { userId: 'user-1' },
    });

    expect(ordersServiceMock.findMyOrders).toHaveBeenCalledWith('user-1');
    expect(result).toEqual([]);
  });

  it('finds one order', async () => {
    ordersServiceMock.findOne.mockResolvedValue({ id: 'order-1' });

    const result = await controller.findOne('order-1');

    expect(ordersServiceMock.findOne).toHaveBeenCalledWith('order-1');
    expect(result.id).toBe('order-1');
  });

  it('updates order status', async () => {
    ordersServiceMock.updateStatus.mockResolvedValue({
      status: 'confirmed',
    });

    const result = await controller.updateStatus('order-1', {
      status: 'confirmed',
    });

    expect(ordersServiceMock.updateStatus).toHaveBeenCalledWith(
      'order-1',
      'confirmed',
    );
    expect(result.status).toBe('confirmed');
  });

  it('cancels order', async () => {
    ordersServiceMock.cancel.mockResolvedValue({
      status: 'cancelled',
    });

    const result = await controller.cancel('order-1');

    expect(ordersServiceMock.cancel).toHaveBeenCalledWith('order-1');
    expect(result.status).toBe('cancelled');
  });
});
