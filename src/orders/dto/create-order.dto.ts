import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiPropertyOptional({
    example: 'menu-item-uuid',
    description: 'Menu item ID if ordering a single menu item',
  })
  @IsOptional()
  @IsUUID()
  menuItemId?: string;

  @ApiPropertyOptional({
    example: 'menu-package-uuid',
    description: 'Menu package ID if ordering a package',
  })
  @IsOptional()
  @IsUUID()
  menuPackageId?: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of selected item or package',
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'reservation-uuid',
    description: 'Reservation ID connected to this order',
  })
  @IsUUID()
  reservationId!: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of ordered menu items or packages',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
