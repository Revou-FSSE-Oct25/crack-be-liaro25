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
  @IsString()
  @IsOptional()
  guestName?: string;

  @IsEmail()
  @IsOptional()
  guestEmail?: string;

  @IsString()
  @IsOptional()
  guestPhone?: string;

  @IsDateString()
  @IsNotEmpty()
  reservationDate!: string;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsInt()
  @Min(1)
  @Max(8)
  guestCount!: number;
}