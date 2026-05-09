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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MenusService } from './menus.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Menus')
@ApiBearerAuth()
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('items')
  @ApiOperation({ summary: 'Get all menu items' })
  @ApiResponse({
    status: 200,
    description: 'List of menu items retrieved successfully',
  })
  findAllMenuItems() {
    return this.menusService.findAllMenuItems();
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Menu item retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  findOneMenuItem(@Param('id') id: string) {
    return this.menusService.findOneMenuItem(id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createMenuItem(
    @Body()
    body: {
      name: string;
      category: string;
      price: number;
    },
  ) {
    return this.menusService.createMenuItem(body);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update menu item' })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateMenuItem(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      category: string;
      price: number;
      status: 'available' | 'unavailable';
    }>,
  ) {
    return this.menusService.updateMenuItem(id, body);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete menu item' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeMenuItem(@Param('id') id: string) {
    return this.menusService.removeMenuItem(id);
  }

  @Get('packages')
  @ApiOperation({ summary: 'Get all menu packages' })
  @ApiResponse({
    status: 200,
    description: 'List of menu packages retrieved successfully',
  })
  findAllMenuPackages() {
    return this.menusService.findAllMenuPackages();
  }

  @Get('packages/:id')
  @ApiOperation({ summary: 'Get menu package by ID' })
  @ApiResponse({
    status: 200,
    description: 'Menu package retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Menu package not found' })
  findOneMenuPackage(@Param('id') id: string) {
    return this.menusService.findOneMenuPackage(id);
  }

  @Post('packages')
  @ApiOperation({ summary: 'Create a new menu package' })
  @ApiResponse({
    status: 201,
    description: 'Menu package created successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createMenuPackage(
    @Body()
    body: {
      name: string;
      price: number;
    },
  ) {
    return this.menusService.createMenuPackage(body);
  }

  @Patch('packages/:id')
  @ApiOperation({ summary: 'Update menu package' })
  @ApiResponse({
    status: 200,
    description: 'Menu package updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Menu package not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateMenuPackage(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      price: number;
      status: 'available' | 'unavailable';
    }>,
  ) {
    return this.menusService.updateMenuPackage(id, body);
  }

  @Delete('packages/:id')
  @ApiOperation({ summary: 'Delete menu package' })
  @ApiResponse({
    status: 200,
    description: 'Menu package deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Menu package not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeMenuPackage(@Param('id') id: string) {
    return this.menusService.removeMenuPackage(id);
  }
}
