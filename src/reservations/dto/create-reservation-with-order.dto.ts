import {
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ReservationOrderItemDto {
  @ApiPropertyOptional({
    example: 'menu-item-id',
  })
  @IsOptional()
  @IsString()
  menuItemId?: string;

  @ApiPropertyOptional({
    example: 'menu-package-id',
  })
  @IsOptional()
  @IsString()
  menuPackageId?: string;

  @ApiProperty({
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateReservationWithOrderDto {
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

  @ApiProperty({
    example: [
      {
        menuItemId: 'menu-item-id',
        quantity: 2,
      },
      {
        menuPackageId: 'menu-package-id',
        quantity: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationOrderItemDto)
  items!: ReservationOrderItemDto[];
}
