import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiPropertyOptional({
    example: 'Guest Customer',
  })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional({
    example: 'guest@mail.com',
  })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional({
    example: '08123456789',
  })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiProperty({
    example: '2026-06-01',
  })
  @IsDateString()
  reservationDate!: string;

  @ApiProperty({
    example: '13:00',
  })
  @IsString()
  startTime!: string;

  @ApiProperty({
    example: 2,
  })
  @IsInt()
  @Min(1)
  guestCount!: number;
}
