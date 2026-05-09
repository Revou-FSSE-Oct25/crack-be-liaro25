import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TablesService } from './tables.service';

@ApiTags('Tables')
@ApiBearerAuth()
@Controller('tables')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new table' })
  @ApiResponse({ status: 201, description: 'Table created successfully' })
  create(
    @Body()
    body: {
      name: string;
      capacity: number;
    },
  ) {
    return this.tablesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tables' })
  @ApiResponse({
    status: 200,
    description: 'List of tables retrieved successfully',
  })
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get table by ID' })
  @ApiResponse({ status: 200, description: 'Table retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Table not found' })
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update table' })
  @ApiResponse({ status: 200, description: 'Table updated successfully' })
  @ApiResponse({ status: 404, description: 'Table not found' })
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      capacity: number;
      status: 'available' | 'unavailable' | 'reserved';
    }>,
  ) {
    return this.tablesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete table' })
  @ApiResponse({ status: 200, description: 'Table deleted successfully' })
  @ApiResponse({ status: 404, description: 'Table not found' })
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }
}
