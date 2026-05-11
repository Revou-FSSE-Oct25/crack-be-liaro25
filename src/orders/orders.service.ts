import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '../../generated/prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: {
    reservationId: string;
    items: {
      menuItemId?: string;
      menuPackageId?: string;
      quantity: number;
    }[];
  }) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: body.reservationId },
      include: { order: true },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.order) {
      throw new BadRequestException(
        'Order already exists for this reservation',
      );
    }

    if (!body.items || body.items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    let subtotal = 0;

    const orderItems: {
      menuItemId?: string;
      menuPackageId?: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of body.items) {
      if (!item.menuItemId && !item.menuPackageId) {
        throw new BadRequestException(
          'Each item must have menuItemId or menuPackageId',
        );
      }

      if (item.menuItemId && item.menuPackageId) {
        throw new BadRequestException(
          'Choose either menuItemId or menuPackageId, not both',
        );
      }

      if (item.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      if (item.menuItemId) {
        const menuItem = await this.prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
        });

        if (!menuItem) {
          throw new NotFoundException('Menu item not found');
        }

        const price = Number(menuItem.price);
        subtotal += price * item.quantity;

        orderItems.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price,
        });
      }

      if (item.menuPackageId) {
        const menuPackage = await this.prisma.menuPackage.findUnique({
          where: { id: item.menuPackageId },
        });

        if (!menuPackage) {
          throw new NotFoundException('Menu package not found');
        }

        const price = Number(menuPackage.price);
        subtotal += price * item.quantity;

        orderItems.push({
          menuPackageId: item.menuPackageId,
          quantity: item.quantity,
          price,
        });
      }
    }

    const tax = subtotal * 0.1;
    const totalAmount = subtotal + tax;

    return this.prisma.order.create({
      data: {
        reservationId: body.reservationId,
        subtotal,
        tax,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        reservation: true,
        items: {
          include: {
            menuItem: true,
            menuPackage: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        reservation: true,
        items: {
          include: {
            menuItem: true,
            menuPackage: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        reservation: true,
        items: {
          include: {
            menuItem: true,
            menuPackage: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async cancel(id: string) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.cancelled,
      },
    });
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: {
        reservation: {
          userId,
        },
      },
      include: {
        reservation: true,
        items: {
          include: {
            menuItem: true,
            menuPackage: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createMyOrder(
    userId: string,
    body: {
      reservationId: string;
      items: {
        menuItemId?: string;
        menuPackageId?: string;
        quantity: number;
      }[];
    },
  ) {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        id: body.reservationId,
        userId,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.create(body);
  }
}
