import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../../generated/prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create payment for order' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  create(
    @Body()
    body: CreatePaymentDto,
  ) {
    return this.paymentsService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({
    status: 200,
    description: 'List of payments retrieved successfully',
  })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my payments' })
  @ApiResponse({
    status: 200,
    description: 'My payments retrieved successfully',
  })
  findMyPayments(@Request() req: any) {
    return this.paymentsService.findMyPayments(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Refund payment' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  refund(@Param('id') id: string) {
    return this.paymentsService.refund(id);
  }

  @Patch(':id/fail')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Fail paymentMark payment as failed' })
  @ApiResponse({ status: 200, description: 'Payment failed successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  fail(@Param('id') id: string) {
    return this.paymentsService.fail(id);
  }
}
