import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { PaymentMethod, PaymentType } from '../../../generated/prisma/client';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'order-uuid',
    description: 'Order ID connected to this payment',
  })
  @IsUUID()
  orderId!: string;

  @ApiProperty({
    example: 5000,
    description: 'Payment amount',
  })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiProperty({
    enum: PaymentType,
    example: PaymentType.deposit,
  })
  @IsEnum(PaymentType)
  paymentType!: PaymentType;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.bank_transfer,
  })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}
