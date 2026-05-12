import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  // MENU ITEMS

  async createMenuItem(body: {
    name: string;
    category: string;
    price: number;
    description?: string;
    imageUrl?: string;
  }) {
    return this.prisma.menuItem.create({
      data: {
        name: body.name.trim(),
        category: body.category.trim(),
        price: body.price,
        description: body.description?.trim(),
        imageUrl: body.imageUrl?.trim(),
      },
    });
  }

  async findAllMenuItems(filters?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    return this.prisma.menuItem.findMany({
      where: {
        AND: [
          filters?.search
            ? {
                OR: [
                  {
                    name: {
                      contains: filters.search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    category: {
                      contains: filters.search,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {},
          filters?.category
            ? {
                category: {
                  equals: filters.category,
                  mode: 'insensitive',
                },
              }
            : {},
          filters?.minPrice !== undefined
            ? {
                price: {
                  gte: filters.minPrice,
                },
              }
            : {},
          filters?.maxPrice !== undefined
            ? {
                price: {
                  lte: filters.maxPrice,
                },
              }
            : {},
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOneMenuItem(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async updateMenuItem(
    id: string,
    body: Partial<{
      name: string;
      category: string;
      price: number;
      status: 'available' | 'unavailable';
      description: string;
      imageUrl: string;
    }>,
  ) {
    await this.findOneMenuItem(id);

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        name: body.name?.trim(),
        category: body.category?.trim(),
        price: body.price,
        status: body.status,
        description: body.description?.trim(),
        imageUrl: body.imageUrl?.trim(),
      },
    });
  }

  async removeMenuItem(id: string) {
    await this.findOneMenuItem(id);

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        status: 'unavailable',
      },
    });
  }

  // MENU PACKAGES

  async createMenuPackage(body: {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
  }) {
    return this.prisma.menuPackage.create({
      data: {
        name: body.name.trim(),
        price: body.price,
        description: body.description?.trim(),
        imageUrl: body.imageUrl?.trim(),
      },
    });
  }

  async findAllMenuPackages() {
    return this.prisma.menuPackage.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOneMenuPackage(id: string) {
    const menuPackage = await this.prisma.menuPackage.findUnique({
      where: { id },
    });

    if (!menuPackage) {
      throw new NotFoundException('Menu package not found');
    }

    return menuPackage;
  }

  async updateMenuPackage(
    id: string,
    body: Partial<{
      name: string;
      price: number;
      status: 'available' | 'unavailable';
      description: string;
      imageUrl: string;
    }>,
  ) {
    await this.findOneMenuPackage(id);

    return this.prisma.menuPackage.update({
      where: { id },
      data: {
        name: body.name?.trim(),
        price: body.price,
        status: body.status,
        description: body.description?.trim(),
        imageUrl: body.imageUrl?.trim(),
      },
    });
  }

  async removeMenuPackage(id: string) {
    await this.findOneMenuPackage(id);

    return this.prisma.menuPackage.update({
      where: { id },
      data: {
        status: 'unavailable',
      },
    });
  }
}
