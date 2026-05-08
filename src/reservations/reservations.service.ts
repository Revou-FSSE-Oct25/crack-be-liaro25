import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

async create(
  body: {
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
  },
  userId?: string,
) {
  const reservationDate = new Date(body.reservationDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  reservationDate.setHours(0, 0, 0, 0);

  if (reservationDate < today) {
    throw new BadRequestException(
      'Reservation date cannot be in the past',
    );
  }

  let guestName = body.guestName;
  let guestEmail = body.guestEmail;
  let guestPhone = body.guestPhone;

  if (userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      guestName = guestName ?? user.name;
      guestEmail = guestEmail ?? user.email;
      guestPhone = guestPhone ?? user.phone ?? '';
    }
  }

  if (!guestName || !guestEmail || !guestPhone) {
    throw new BadRequestException(
      'Guest name, email, and phone are required',
    );
  }

  return this.prisma.reservation.create({
    data: {
      userId: userId ?? null,
      guestName,
      guestEmail,
      guestPhone,
      reservationCode: `CRACK-${Date.now()}`,
      reservationDate,
      startTime: body.startTime,
      endTime: body.endTime,
      guestCount: body.guestCount,
    },
  });
}

  async findAll() {
    return this.prisma.reservation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async update(
  id: string,
  body: Partial<{
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  }>,
  user: {
    userId: string;
    role: string;
  },
) {
  const reservation = await this.findOne(id);

  if (
    user.role !== 'ADMIN' &&
    reservation.userId !== user.userId
  ) {
    throw new BadRequestException(
      'You are not allowed to update this reservation',
    );
  }

  return this.prisma.reservation.update({
    where: { id },
    data: {
      ...body,
      reservationDate: body.reservationDate
        ? new Date(body.reservationDate)
        : undefined,
    },
  });
}

  async remove(
  id: string,
  user: {
    userId: string;
    role: string;
  },
) {
  const reservation = await this.findOne(id);

  if (
    user.role !== 'ADMIN' &&
    reservation.userId !== user.userId
  ) {
    throw new BadRequestException(
      'You are not allowed to cancel this reservation',
    );
  }

  return this.prisma.reservation.update({
    where: { id },
    data: {
      status: 'cancelled',
    },
  });
}

  async findMyReservations(userId: string) {
  return this.prisma.reservation.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}