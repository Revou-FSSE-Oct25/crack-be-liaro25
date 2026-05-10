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
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully',
  })
  create(@Request() req: any, @Body() body: CreateReservationDto) {
    return this.reservationsService.create(body, req.user?.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all reservations (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Reservations retrieved successfully',
  })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my reservations' })
  @ApiResponse({
    status: 200,
    description: 'User reservations retrieved successfully',
  })
  findMyReservations(@Request() req: any) {
    return this.reservationsService.findMyReservations(req.user.userId);
  }

  @Get('code/:reservationCode')
  @ApiOperation({ summary: 'Get reservation by reservation code' })
  @ApiResponse({
    status: 200,
    description: 'Reservation retrieved successfully by reservation code',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  findByReservationCode(@Param('reservationCode') reservationCode: string) {
    return this.reservationsService.findByReservationCode(reservationCode);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.reservationsService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update reservation' })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  update(@Param('id') id: string, @Body() body: UpdateReservationDto) {
    return this.reservationsService.update(id, body);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel reservation' })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled successfully',
  })
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.reservationsService.cancel(id, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete reservation (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Reservation deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
