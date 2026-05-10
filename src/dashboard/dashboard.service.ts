import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminSummary() {
    const [
      totalReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      cancelledReservations,
      totalOrders,
      paidPayments,
    ] = await Promise.all([
      this.prisma.reservation.count(),
      this.prisma.reservation.count({ where: { status: 'pending' } }),
      this.prisma.reservation.count({ where: { status: 'confirmed' } }),
      this.prisma.reservation.count({ where: { status: 'completed' } }),
      this.prisma.reservation.count({ where: { status: 'cancelled' } }),
      this.prisma.order.count(),
      this.prisma.payment.findMany({
        where: { status: 'paid' },
        select: { amount: true },
      }),
    ]);

    const totalRevenue = paidPayments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    return {
      totalReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      cancelledReservations,
      totalOrders,
      totalRevenue,
    };
  }

  async getCustomerSummary(userId: string) {
    const [
      totalReservations,
      upcomingReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      cancelledReservations,
    ] = await Promise.all([
      this.prisma.reservation.count({
        where: { userId },
      }),
      this.prisma.reservation.count({
        where: {
          userId,
          status: {
            in: ['pending', 'confirmed'],
          },
          reservationDate: {
            gte: new Date(),
          },
        },
      }),
      this.prisma.reservation.count({
        where: { userId, status: 'pending' },
      }),
      this.prisma.reservation.count({
        where: { userId, status: 'confirmed' },
      }),
      this.prisma.reservation.count({
        where: { userId, status: 'completed' },
      }),
      this.prisma.reservation.count({
        where: { userId, status: 'cancelled' },
      }),
    ]);

    return {
      totalReservations,
      upcomingReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      cancelledReservations,
    };
  }
}
