import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export class UpdateReservationDto {
  @ApiPropertyOptional({
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  reservationDate?: string;

  @ApiPropertyOptional({
    example: '17:00',
    description: 'Reservation start time between 11:00 and 18:00',
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    example: 4,
    minimum: 1,
    maximum: 8,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  guestCount?: number;
}
