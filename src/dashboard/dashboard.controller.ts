import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get admin dashboard summary' })
  @ApiResponse({
    status: 200,
    description: 'Admin dashboard summary retrieved successfully',
  })
  getAdminSummary() {
    return this.dashboardService.getAdminSummary();
  }

  @Get('customer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get customer dashboard summary' })
  @ApiResponse({
    status: 200,
    description: 'Customer dashboard summary retrieved successfully',
  })
  getCustomerSummary(@Request() req: any) {
    return this.dashboardService.getCustomerSummary(req.user.userId);
  }
}
