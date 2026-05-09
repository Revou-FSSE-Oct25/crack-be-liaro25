import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from '../../generated/prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: {
    orderId: string;
    amount: number;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: body.orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (body.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const totalPaid = order.payments
      .filter((payment) => payment.status === PaymentStatus.paid)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    const remainingAmount = Number(order.totalAmount) - totalPaid;

    if (body.amount > remainingAmount) {
      throw new BadRequestException('Payment amount exceeds remaining balance');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: body.orderId,
        amount: body.amount,
        paymentType: body.paymentType,
        paymentMethod: body.paymentMethod,
        status: PaymentStatus.paid,
      },
      include: {
        order: true,
      },
    });

    const newTotalPaid = totalPaid + body.amount;

    if (newTotalPaid >= Number(order.totalAmount)) {
      await this.prisma.order.update({
        where: { id: body.orderId },
        data: {
          status: 'confirmed',
        },
      });
    }

    return payment;
  }

  findAll() {
    return this.prisma.payment.findMany({
      include: {
        order: {
          include: {
            reservation: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            reservation: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async refund(id: string) {
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.refunded,
      },
    });
  }

  async fail(id: string) {
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.failed,
      },
    });
  }

  async findMyPayments(userId: string) {
  return this.prisma.payment.findMany({
    where: {
      order: {
        reservation: {
          userId,
        },
      },
    },
    include: {
      order: {
        include: {
          reservation: true,
          items: {
            include: {
              menuItem: true,
              menuPackage: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}