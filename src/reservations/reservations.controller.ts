import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Request() req: any,
    @Body()
    body: {
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      reservationDate: string;
      startTime: string;
      endTime: string;
      guestCount: number;
    },
  ) {
    return this.reservationsService.create(body, req.user?.userId);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyReservations(@Request() req: any) {
    return this.reservationsService.findMyReservations(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
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
    return this.reservationsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}