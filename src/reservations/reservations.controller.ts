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
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully' })
  create(
    @Request() req: any,
    @Body()
    body: {
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      reservationDate: string;
      startTime: string;
      guestCount: number;
    },
  ) {
    return this.reservationsService.create(body, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiResponse({
    status: 200,
    description: 'List of reservations retrieved successfully',
  })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my reservations' })
  @ApiResponse({
    status: 200,
    description: 'My reservations retrieved successfully',
  })
  findMyReservations(@Request() req: any) {
    return this.reservationsService.findMyReservations(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update reservation' })
  @ApiResponse({ status: 200, description: 'Reservation updated successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  update(
    @Request() req: any,
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
    return this.reservationsService.update(id, body, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete reservation' })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.reservationsService.remove(id, req.user);
  }
}
