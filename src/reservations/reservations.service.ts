import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
  }) {
    const reservationDate = new Date(body.reservationDate);
const today = new Date();

today.setHours(0, 0, 0, 0);
reservationDate.setHours(0, 0, 0, 0);

if (reservationDate < today) {
  throw new BadRequestException('Reservation date cannot be in the past');
}
    return this.prisma.reservation.create({
      data: {
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
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
  ) {
    await this.findOne(id);

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

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }
}