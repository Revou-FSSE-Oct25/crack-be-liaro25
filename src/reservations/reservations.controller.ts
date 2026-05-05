import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() body: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    guestCount: number;
  }) {
    return this.reservationsService.create(body);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{
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