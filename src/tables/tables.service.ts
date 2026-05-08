import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: { name: string; capacity: number }) {
    const existingTable = await this.prisma.table.findUnique({
      where: { name: body.name },
    });

    if (existingTable) {
      throw new BadRequestException('Table name already exists');
    }

    return this.prisma.table.create({
      data: {
        name: body.name.trim(),
        capacity: body.capacity,
      },
    });
  }

  async findAll() {
    return this.prisma.table.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const table = await this.prisma.table.findUnique({
      where: { id },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  async update(
    id: string,
    body: Partial<{
      name: string;
      capacity: number;
      status: 'available' | 'unavailable' | 'reserved';
    }>,
  ) {
    await this.findOne(id);

    return this.prisma.table.update({
      where: { id },
      data: {
        name: body.name?.trim(),
        capacity: body.capacity,
        status: body.status,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.table.update({
      where: { id },
      data: {
        status: 'unavailable',
      },
    });
  }
}