import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    // This is a placeholder for the UsersService. You can implement user-related logic here.
    constructor(private readonly prisma: PrismaService) {}

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    createUser(data: { name: string; email: string; password: string; phone?: string;
    address?: string;
    dateOfBirth?: Date;}) {
        return this.prisma.user.create({ data });
    }
}
