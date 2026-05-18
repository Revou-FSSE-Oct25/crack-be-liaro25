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

jest.mock('./reservations.service', () => ({
  ReservationsService: jest.fn(),
}));

const { ReservationsController } = require('./reservations.controller');

describe('ReservationsController', () => {
  let controller: any;

  const reservationsServiceMock = {
    create: jest.fn(),
    createWithOrder: jest.fn(),
    findAll: jest.fn(),
    findMyReservations: jest.fn(),
    findByReservationCode: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    reschedule: jest.fn(),
    cancel: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ReservationsController(reservationsServiceMock);
  });

  it('creates reservation', async () => {
    reservationsServiceMock.create.mockResolvedValue({ id: 'reservation-1' });

    const result = await controller.create(
      { user: { userId: 'user-1' } },
      { guestName: 'Lia' },
    );

    expect(reservationsServiceMock.create).toHaveBeenCalledWith(
      { guestName: 'Lia' },
      'user-1',
    );

    expect(result.id).toBe('reservation-1');
  });

  it('creates reservation without user id', async () => {
    reservationsServiceMock.create.mockResolvedValue({ id: 'reservation-1' });

    const result = await controller.create({}, { guestName: 'Lia' });

    expect(reservationsServiceMock.create).toHaveBeenCalledWith(
      { guestName: 'Lia' },
      undefined,
    );

    expect(result.id).toBe('reservation-1');
  });

  it('creates reservation with order', async () => {
    reservationsServiceMock.createWithOrder.mockResolvedValue({
      id: 'reservation-1',
    });

    const result = await controller.createWithOrder(
      { guestName: 'Lia' },
      { user: { userId: 'user-1' } },
    );

    expect(reservationsServiceMock.createWithOrder).toHaveBeenCalledWith(
      { guestName: 'Lia' },
      'user-1',
    );

    expect(result.id).toBe('reservation-1');
  });

  it('finds all reservations', async () => {
    reservationsServiceMock.findAll.mockResolvedValue([]);

    const result = await controller.findAll('pending', '2030-01-01', 'WHISK');

    expect(reservationsServiceMock.findAll).toHaveBeenCalledWith({
      status: 'pending',
      date: '2030-01-01',
      search: 'WHISK',
    });

    expect(result).toEqual([]);
  });

  it('finds my reservations', async () => {
    reservationsServiceMock.findMyReservations.mockResolvedValue([]);

    const result = await controller.findMyReservations({
      user: { userId: 'user-1' },
    });

    expect(reservationsServiceMock.findMyReservations).toHaveBeenCalledWith(
      'user-1',
    );

    expect(result).toEqual([]);
  });

  it('finds reservation by code', async () => {
    reservationsServiceMock.findByReservationCode.mockResolvedValue({
      reservationCode: 'WHISK-123',
    });

    const result = await controller.findByReservationCode('WHISK-123');

    expect(reservationsServiceMock.findByReservationCode).toHaveBeenCalledWith(
      'WHISK-123',
    );

    expect(result.reservationCode).toBe('WHISK-123');
  });

  it('finds reservation by id', async () => {
    reservationsServiceMock.findOne.mockResolvedValue({
      id: 'reservation-1',
    });

    const result = await controller.findOne('reservation-1', {
      user: { userId: 'user-1', role: 'CUSTOMER' },
    });

    expect(reservationsServiceMock.findOne).toHaveBeenCalledWith(
      'reservation-1',
      {
        userId: 'user-1',
        role: 'CUSTOMER',
      },
    );

    expect(result.id).toBe('reservation-1');
  });

  it('updates reservation', async () => {
    reservationsServiceMock.update.mockResolvedValue({
      status: 'confirmed',
    });

    const result = await controller.update('reservation-1', {
      status: 'confirmed',
    });

    expect(reservationsServiceMock.update).toHaveBeenCalledWith(
      'reservation-1',
      { status: 'confirmed' },
    );

    expect(result.status).toBe('confirmed');
  });

  it('reschedules reservation', async () => {
    reservationsServiceMock.reschedule.mockResolvedValue({
      startTime: '13:00',
    });

    const result = await controller.reschedule(
      'reservation-1',
      { reservationDate: '2030-01-01', startTime: '13:00' },
      { user: { userId: 'user-1', role: 'CUSTOMER' } },
    );

    expect(reservationsServiceMock.reschedule).toHaveBeenCalledWith(
      'reservation-1',
      {
        userId: 'user-1',
        role: 'CUSTOMER',
      },
      { reservationDate: '2030-01-01', startTime: '13:00' },
    );

    expect(result.startTime).toBe('13:00');
  });

  it('cancels reservation', async () => {
    reservationsServiceMock.cancel.mockResolvedValue({
      status: 'cancelled',
    });

    const result = await controller.cancel('reservation-1', {
      user: { userId: 'user-1', role: 'CUSTOMER' },
    });

    expect(reservationsServiceMock.cancel).toHaveBeenCalledWith(
      'reservation-1',
      {
        userId: 'user-1',
        role: 'CUSTOMER',
      },
    );

    expect(result.status).toBe('cancelled');
  });

  it('removes reservation', async () => {
    reservationsServiceMock.remove.mockResolvedValue({
      id: 'reservation-1',
    });

    const result = await controller.remove('reservation-1');

    expect(reservationsServiceMock.remove).toHaveBeenCalledWith(
      'reservation-1',
    );

    expect(result.id).toBe('reservation-1');
  });
});
