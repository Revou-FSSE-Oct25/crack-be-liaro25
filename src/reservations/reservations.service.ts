import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateEndTime(startTime: string): string {
    const [hours, minutes] = startTime.split(':').map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + 120);

    return date.toTimeString().slice(0, 5);
  }

  private findBestTableCombination(
    tables: { id: string; capacity: number }[],
    guestCount: number,
  ): { id: string; capacity: number }[] | null {
    const sortedTables = [...tables].sort((a, b) => a.capacity - b.capacity);

    let bestCombination: { id: string; capacity: number }[] | null = null;
    let bestExtraSeats = Infinity;

    const findCombination = (
      index: number,
      currentCombination: { id: string; capacity: number }[],
      currentCapacity: number,
    ) => {
      if (currentCapacity >= guestCount) {
        const extraSeats = currentCapacity - guestCount;

        if (
          extraSeats < bestExtraSeats ||
          (extraSeats === bestExtraSeats &&
            currentCombination.length < (bestCombination?.length ?? Infinity))
        ) {
          bestCombination = currentCombination;
          bestExtraSeats = extraSeats;
        }

        return;
      }

      for (let i = index; i < sortedTables.length; i++) {
        findCombination(
          i + 1,
          [...currentCombination, sortedTables[i]],
          currentCapacity + sortedTables[i].capacity,
        );
      }
    };

    findCombination(0, [], 0);

    return bestCombination;
  }

  async create(
    body: {
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      reservationDate: string;
      startTime: string;
      guestCount: number;
    },
    userId?: string,
  ) {
    const reservationDate = new Date(body.reservationDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    reservationDate.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      throw new BadRequestException('Reservation date cannot be in the past');
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

    const endTime = this.calculateEndTime(body.startTime);

    const overlappingReservations = await this.prisma.reservation.findMany({
      where: {
        reservationDate,
        status: {
          not: 'cancelled',
        },
        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: body.startTime,
            },
          },
        ],
      },
      include: {
        tables: true,
      },
    });

    const reservedTableIds = overlappingReservations.flatMap((reservation) =>
      reservation.tables.map((table) => table.tableId),
    );

    const availableTables = await this.prisma.table.findMany({
      where: {
        status: 'available',
        id: {
          notIn: reservedTableIds,
        },
      },
      orderBy: {
        capacity: 'asc',
      },
    });

    const selectedTables = this.findBestTableCombination(
      availableTables,
      body.guestCount,
    );

    if (!selectedTables) {
      throw new BadRequestException(
        'No available table for this reservation time',
      );
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        userId: userId ?? null,
        guestName,
        guestEmail,
        guestPhone,
        reservationCode: `WHISK-${Date.now()}`,
        reservationDate,
        startTime: body.startTime,
        endTime,
        guestCount: body.guestCount,

        tables: {
          create: selectedTables.map((table) => ({
            tableId: table.id,
          })),
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

    return reservation;
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

    if (user.role !== 'ADMIN' && reservation.userId !== user.userId) {
      throw new ForbiddenException(
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

    if (user.role !== 'ADMIN' && reservation.userId !== user.userId) {
      throw new ForbiddenException(
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
  async findByReservationCode(reservationCode: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { reservationCode },
      include: {
        tables: {
          include: {
            table: true,
          },
        },
        order: {
          include: {
            items: {
              include: {
                menuItem: true,
                menuPackage: true,
              },
            },
            payments: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }
}
