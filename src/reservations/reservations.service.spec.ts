import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

const { ReservationsService } = require('./reservations.service');

describe('ReservationsService', () => {
  let service: any;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    reservation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    table: {
      findMany: jest.fn(),
    },
    menuItem: {
      findUnique: jest.fn(),
    },
    menuPackage: {
      findUnique: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
  };

  const futureDate = '2030-01-15';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1234567890);
    service = new ReservationsService(prismaMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('creates guest reservation successfully', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      prismaMock.table.findMany.mockResolvedValue([
        { id: 'table-1', capacity: 2 },
        { id: 'table-2', capacity: 4 },
      ]);

      const createdReservation = {
        id: 'reservation-1',
        reservationCode: 'WHISK-1234567890',
      };

      prismaMock.reservation.create.mockResolvedValue(createdReservation);

      const result = await service.create({
        guestName: 'Lia',
        guestEmail: 'lia@mail.com',
        guestPhone: '123',
        reservationDate: futureDate,
        startTime: '11:00',
        guestCount: 2,
      });

      expect(prismaMock.reservation.create).toHaveBeenCalledWith({
        data: {
          userId: null,
          guestName: 'Lia',
          guestEmail: 'lia@mail.com',
          guestPhone: '123',
          reservationCode: 'WHISK-1234567890',
          reservationDate: new Date(futureDate),
          startTime: '11:00',
          endTime: '13:00',
          guestCount: 2,
          tables: {
            create: [{ tableId: 'table-1' }],
          },
        },
        include: {
          tables: {
            include: {
              table: true,
            },
          },
        },
      });

      expect(result).toEqual(createdReservation);
    });

    it('creates authenticated reservation using user data', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Lia',
        email: 'lia@mail.com',
        phone: '123',
      });

      prismaMock.reservation.findMany.mockResolvedValue([]);
      prismaMock.table.findMany.mockResolvedValue([
        { id: 'table-1', capacity: 4 },
      ]);
      prismaMock.reservation.create.mockResolvedValue({ id: 'reservation-1' });

      const result = await service.create(
        {
          reservationDate: futureDate,
          startTime: '12:00',
          guestCount: 4,
        },
        'user-1',
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });

      expect(prismaMock.reservation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            guestName: 'Lia',
            guestEmail: 'lia@mail.com',
            guestPhone: '123',
            endTime: '14:00',
          }),
        }),
      );

      expect(result.id).toBe('reservation-1');
    });

    it('throws BadRequestException for invalid start time', async () => {
      await expect(
        service.create({
          guestName: 'Lia',
          guestEmail: 'lia@mail.com',
          guestPhone: '123',
          reservationDate: futureDate,
          startTime: '25:00',
          guestCount: 2,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws BadRequestException when time is outside business hours', async () => {
      await expect(
        service.create({
          guestName: 'Lia',
          guestEmail: 'lia@mail.com',
          guestPhone: '123',
          reservationDate: futureDate,
          startTime: '10:00',
          guestCount: 2,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws BadRequestException when guest data is missing', async () => {
      await expect(
        service.create({
          reservationDate: futureDate,
          startTime: '11:00',
          guestCount: 2,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws BadRequestException when no table is available', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      prismaMock.table.findMany.mockResolvedValue([
        { id: 'table-1', capacity: 2 },
      ]);

      await expect(
        service.create({
          guestName: 'Lia',
          guestEmail: 'lia@mail.com',
          guestPhone: '123',
          reservationDate: futureDate,
          startTime: '11:00',
          guestCount: 10,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  it('finds all reservations with filters', async () => {
    prismaMock.reservation.findMany.mockResolvedValue([
      { id: 'reservation-1' },
    ]);

    const result = await service.findAll({
      status: 'pending',
      date: futureDate,
      search: 'Lia',
    });

    expect(prismaMock.reservation.findMany).toHaveBeenCalledWith({
      where: {
        status: 'pending',
        reservationDate: new Date(futureDate),
        OR: expect.any(Array),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: expect.any(Object),
    });

    expect(result).toEqual([{ id: 'reservation-1' }]);
  });

  it('finds my reservations', async () => {
    prismaMock.reservation.findMany.mockResolvedValue([
      { id: 'reservation-1' },
    ]);

    const result = await service.findMyReservations('user-1');

    expect(prismaMock.reservation.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: {
        createdAt: 'desc',
      },
      include: expect.any(Object),
    });

    expect(result).toEqual([{ id: 'reservation-1' }]);
  });

  describe('findOne', () => {
    it('finds reservation for admin', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        userId: 'user-1',
      });

      const result = await service.findOne('reservation-1', {
        userId: 'admin-1',
        role: 'ADMIN',
      });

      expect(result.id).toBe('reservation-1');
    });

    it('throws NotFoundException when reservation is missing', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws ForbiddenException when customer accesses other user reservation', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        userId: 'other-user',
      });

      await expect(
        service.findOne('reservation-1', {
          userId: 'user-1',
          role: 'CUSTOMER',
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  it('finds reservation by reservation code', async () => {
    prismaMock.reservation.findUnique.mockResolvedValue({
      id: 'reservation-1',
      reservationCode: 'WHISK-123',
    });

    const result = await service.findByReservationCode('WHISK-123');

    expect(result.reservationCode).toBe('WHISK-123');
  });

  it('throws NotFoundException when reservation code is missing', async () => {
    prismaMock.reservation.findUnique.mockResolvedValue(null);

    await expect(
      service.findByReservationCode('INVALID'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  describe('update', () => {
    it('updates reservation status without table reassignment', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        reservationDate: new Date(futureDate),
        startTime: '11:00',
        guestCount: 2,
      });

      prismaMock.reservation.update.mockResolvedValue({
        id: 'reservation-1',
        status: 'confirmed',
      });

      const result = await service.update('reservation-1', {
        status: 'confirmed',
      });

      expect(prismaMock.reservation.update).toHaveBeenCalledWith({
        where: { id: 'reservation-1' },
        data: {
          guestName: undefined,
          guestEmail: undefined,
          guestPhone: undefined,
          status: 'confirmed',
        },
        include: expect.any(Object),
      });

      expect(result.status).toBe('confirmed');
    });

    it('updates reservation with table reassignment', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        reservationDate: new Date(futureDate),
        startTime: '11:00',
        guestCount: 2,
      });

      prismaMock.reservation.findMany.mockResolvedValue([]);
      prismaMock.table.findMany.mockResolvedValue([
        { id: 'table-2', capacity: 4 },
      ]);
      prismaMock.reservation.update.mockResolvedValue({
        id: 'reservation-1',
        guestCount: 4,
      });

      const result = await service.update('reservation-1', {
        reservationDate: futureDate,
        startTime: '12:00',
        guestCount: 4,
      });

      expect(prismaMock.reservation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'reservation-1' },
          data: expect.objectContaining({
            startTime: '12:00',
            endTime: '14:00',
            guestCount: 4,
            tables: {
              deleteMany: {},
              create: [{ tableId: 'table-2' }],
            },
          }),
        }),
      );

      expect(result.guestCount).toBe(4);
    });
  });

  describe('reschedule', () => {
    it('reschedules reservation successfully', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        userId: 'user-1',
        status: 'pending',
        guestCount: 2,
      });

      prismaMock.reservation.findMany.mockResolvedValue([]);
      prismaMock.table.findMany.mockResolvedValue([
        { id: 'table-1', capacity: 2 },
      ]);
      prismaMock.reservation.update.mockResolvedValue({
        id: 'reservation-1',
        status: 'pending',
        startTime: '13:00',
      });

      const result = await service.reschedule(
        'reservation-1',
        { userId: 'user-1', role: 'CUSTOMER' },
        {
          reservationDate: futureDate,
          startTime: '13:00',
        },
      );

      expect(prismaMock.reservation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            startTime: '13:00',
            endTime: '15:00',
            status: 'pending',
          }),
        }),
      );

      expect(result.startTime).toBe('13:00');
    });

    it('throws ForbiddenException when customer reschedules other user reservation', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        userId: 'other-user',
        status: 'pending',
      });

      await expect(
        service.reschedule(
          'reservation-1',
          { userId: 'user-1', role: 'CUSTOMER' },
          {
            reservationDate: futureDate,
            startTime: '13:00',
          },
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('throws BadRequestException when cancelled reservation is rescheduled', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        userId: 'user-1',
        status: 'cancelled',
      });

      await expect(
        service.reschedule(
          'reservation-1',
          { userId: 'user-1', role: 'CUSTOMER' },
          {
            reservationDate: futureDate,
            startTime: '13:00',
          },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('cancels reservation successfully', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        userId: 'user-1',
        status: 'pending',
      });

      prismaMock.reservation.update.mockResolvedValue({
        id: 'reservation-1',
        status: 'cancelled',
      });

      const result = await service.cancel('reservation-1', {
        userId: 'user-1',
        role: 'CUSTOMER',
      });

      expect(prismaMock.reservation.update).toHaveBeenCalledWith({
        where: { id: 'reservation-1' },
        data: {
          status: 'cancelled',
        },
        include: expect.any(Object),
      });

      expect(result.status).toBe('cancelled');
    });

    it('throws ForbiddenException when customer cancels other user reservation', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        userId: 'other-user',
        status: 'pending',
      });

      await expect(
        service.cancel('reservation-1', {
          userId: 'user-1',
          role: 'CUSTOMER',
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('throws BadRequestException when reservation already cancelled', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue({
        id: 'reservation-1',
        userId: 'user-1',
        status: 'cancelled',
      });

      await expect(
        service.cancel('reservation-1', {
          userId: 'user-1',
          role: 'CUSTOMER',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  it('removes reservation', async () => {
    prismaMock.reservation.findUnique.mockResolvedValue({
      id: 'reservation-1',
    });

    prismaMock.reservation.delete.mockResolvedValue({
      id: 'reservation-1',
    });

    const result = await service.remove('reservation-1');

    expect(prismaMock.reservation.delete).toHaveBeenCalledWith({
      where: { id: 'reservation-1' },
    });

    expect(result.id).toBe('reservation-1');
  });

  describe('createWithOrder', () => {
    it('creates reservation with menu item order', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      prismaMock.table.findMany.mockResolvedValue([
        { id: 'table-1', capacity: 2 },
      ]);

      prismaMock.reservation.create.mockResolvedValue({
        id: 'reservation-1',
      });

      prismaMock.menuItem.findUnique.mockResolvedValue({
        id: 'menu-1',
        price: 50000,
      });

      prismaMock.order.create.mockResolvedValue({
        id: 'order-1',
        subtotal: 100000,
      });

      const result = await service.createWithOrder(
        {
          guestName: 'Lia',
          guestEmail: 'lia@mail.com',
          guestPhone: '123',
          reservationDate: futureDate,
          startTime: '11:00',
          guestCount: 2,
          items: [{ menuItemId: 'menu-1', quantity: 2 }],
        },
        '',
      );

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

      expect(result.order.id).toBe('order-1');
    });

    it('returns reservation only when no order items provided', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      prismaMock.table.findMany.mockResolvedValue([
        { id: 'table-1', capacity: 2 },
      ]);
      prismaMock.reservation.create.mockResolvedValue({
        id: 'reservation-1',
      });

      const result = await service.createWithOrder(
        {
          guestName: 'Lia',
          guestEmail: 'lia@mail.com',
          guestPhone: '123',
          reservationDate: futureDate,
          startTime: '11:00',
          guestCount: 2,
          items: [],
        },
        '',
      );

      expect(prismaMock.order.create).not.toHaveBeenCalled();
      expect(result.id).toBe('reservation-1');
    });

    it('throws NotFoundException when menu item is missing', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);
      prismaMock.table.findMany.mockResolvedValue([
        { id: 'table-1', capacity: 2 },
      ]);
      prismaMock.reservation.create.mockResolvedValue({
        id: 'reservation-1',
      });

      prismaMock.menuItem.findUnique.mockResolvedValue(null);

      await expect(
        service.createWithOrder(
          {
            guestName: 'Lia',
            guestEmail: 'lia@mail.com',
            guestPhone: '123',
            reservationDate: futureDate,
            startTime: '11:00',
            guestCount: 2,
            items: [{ menuItemId: 'missing', quantity: 1 }],
          },
          '',
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
