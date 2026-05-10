import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  ApiBody,
  ApiOperation,
  ApiQuery,
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
    return this.reservationsService.create(
      body,
      req.user?.userId ?? req.user?.id,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all reservations with filters (Admin only)' })
  @ApiQuery({ name: 'status', required: false, example: 'pending' })
  @ApiQuery({ name: 'date', required: false, example: '2026-06-01' })
  @ApiQuery({ name: 'search', required: false, example: 'WHISK' })
  findAll(
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('search') search?: string,
  ) {
    return this.reservationsService.findAll({
      status,
      date,
      search,
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my reservations' })
  findMyReservations(@Request() req: any) {
    return this.reservationsService.findMyReservations(
      req.user.userId ?? req.user.id,
    );
  }

  @Get('code/:reservationCode')
  @ApiOperation({ summary: 'Get reservation by reservation code' })
  findByReservationCode(@Param('reservationCode') reservationCode: string) {
    return this.reservationsService.findByReservationCode(reservationCode);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get reservation by ID' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.reservationsService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update reservation (Admin only)' })
  update(@Param('id') id: string, @Body() body: UpdateReservationDto) {
    return this.reservationsService.update(id, body);
  }

  @Patch(':id/reschedule')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reschedule own reservation' })
  @ApiBody({
    schema: {
      example: {
        reservationDate: '2026-06-01',
        startTime: '13:00',
      },
    },
  })
  reschedule(
    @Param('id') id: string,
    @Body()
    body: {
      reservationDate: string;
      startTime: string;
    },
    @Request() req: any,
  ) {
    return this.reservationsService.reschedule(id, req.user, body);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel reservation' })
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.reservationsService.cancel(id, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete reservation (Admin only)' })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
