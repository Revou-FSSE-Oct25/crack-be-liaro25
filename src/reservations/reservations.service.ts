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

  private validateReservationTime(startTime: string) {
    const [hours, minutes] = startTime.split(':').map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new BadRequestException('Invalid start time format');
    }

    const startMinutes = hours * 60 + minutes;
    const openingMinutes = 11 * 60;
    const latestStartMinutes = 18 * 60;

    if (startMinutes < openingMinutes || startMinutes > latestStartMinutes) {
      throw new BadRequestException(
        'Reservation time must be between 11:00 and 18:00',
      );
    }
  }

  private calculateEndTime(startTime: string): string {
    const [hours, minutes] = startTime.split(':').map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + 120);

    return date.toTimeString().slice(0, 5);
  }

  private validateReservationDate(reservationDate: Date) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    reservationDate.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      throw new BadRequestException('Reservation date cannot be in the past');
    }
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

  private async getAvailableTables(
    reservationDate: Date,
    startTime: string,
    endTime: string,
    excludeReservationId?: string,
  ) {
    const overlappingReservations = await this.prisma.reservation.findMany({
      where: {
        id: excludeReservationId
          ? {
              not: excludeReservationId,
            }
          : undefined,
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
              gt: startTime,
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

    return this.prisma.table.findMany({
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
    this.validateReservationTime(body.startTime);

    const reservationDate = new Date(body.reservationDate);
    this.validateReservationDate(reservationDate);

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

    const availableTables = await this.getAvailableTables(
      reservationDate,
      body.startTime,
      endTime,
    );

    const selectedTables = this.findBestTableCombination(
      availableTables,
      body.guestCount,
    );

    if (!selectedTables) {
      throw new BadRequestException(
        'No available table for this reservation time',
      );
    }

    return this.prisma.reservation.create({
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
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        tables: {
          include: {
            table: true,
          },
        },
        order: true,
      },
    });
  }

  async findMyReservations(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tables: {
          include: {
            table: true,
          },
        },
        order: true,
      },
    });
  }

  async findOne(
    id: string,
    user?: {
      userId: string;
      role: string;
    },
  ) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        tables: {
          include: {
            table: true,
          },
        },
        order: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (user && user.role !== 'ADMIN' && reservation.userId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to access this reservation',
      );
    }

    return reservation;
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

  async update(
    id: string,
    body: Partial<{
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      reservationDate: string;
      startTime: string;
      guestCount: number;
      status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    }>,
  ) {
    const reservation = await this.findOne(id);

    const updatedReservationDate = body.reservationDate
      ? new Date(body.reservationDate)
      : reservation.reservationDate;

    const updatedStartTime = body.startTime ?? reservation.startTime;
    const updatedGuestCount = body.guestCount ?? reservation.guestCount;

    this.validateReservationTime(updatedStartTime);
    this.validateReservationDate(updatedReservationDate);

    const updatedEndTime = this.calculateEndTime(updatedStartTime);

    const shouldReassignTables =
      body.reservationDate !== undefined ||
      body.startTime !== undefined ||
      body.guestCount !== undefined;

    if (shouldReassignTables) {
      const availableTables = await this.getAvailableTables(
        updatedReservationDate,
        updatedStartTime,
        updatedEndTime,
        id,
      );

      const selectedTables = this.findBestTableCombination(
        availableTables,
        updatedGuestCount,
      );

      if (!selectedTables) {
        throw new BadRequestException(
          'No available table for this reservation time',
        );
      }

      return this.prisma.reservation.update({
        where: { id },
        data: {
          guestName: body.guestName,
          guestEmail: body.guestEmail,
          guestPhone: body.guestPhone,
          reservationDate: updatedReservationDate,
          startTime: updatedStartTime,
          endTime: updatedEndTime,
          guestCount: updatedGuestCount,
          status: body.status,
          tables: {
            deleteMany: {},
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
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        status: body.status,
      },
      include: {
        tables: {
          include: {
            table: true,
          },
        },
      },
    });
  }

  async cancel(
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

    if (reservation.status === 'cancelled') {
      throw new BadRequestException('Reservation is already cancelled');
    }

    if (reservation.status === 'completed') {
      throw new BadRequestException(
        'Completed reservation cannot be cancelled',
      );
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
      include: {
        tables: {
          include: {
            table: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.reservation.delete({
      where: { id },
    });
  }
}
