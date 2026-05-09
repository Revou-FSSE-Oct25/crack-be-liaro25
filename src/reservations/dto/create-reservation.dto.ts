import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @ApiPropertyOptional({ example: 'Guest Customer' })
  @IsString()
  @IsOptional()
  guestName?: string;

  @ApiPropertyOptional({ example: 'guest@mail.com' })
  @IsEmail()
  @IsOptional()
  guestEmail?: string;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsString()
  @IsOptional()
  guestPhone?: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  @IsNotEmpty()
  reservationDate!: string;

  @ApiProperty({
    example: '18:00',
    description: 'Reservation start time between 11:00 and 18:00',
  })
  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @ApiProperty({
    example: 4,
    minimum: 1,
    maximum: 8,
  })
  @IsInt()
  @Min(1)
  @Max(8)
  guestCount!: number;
}
