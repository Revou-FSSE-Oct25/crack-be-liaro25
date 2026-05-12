import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MenusService } from './menus.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { CreateMenuPackageDto } from './dto/create-menu-package.dto';
import { UpdateMenuPackageDto } from './dto/update-menu-package.dto';

@ApiTags('Menus')
@ApiBearerAuth()
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('items')
  @ApiOperation({ summary: 'Get all menu items with search and filters' })
  @ApiQuery({ name: 'search', required: false, example: 'scone' })
  @ApiQuery({ name: 'category', required: false, example: 'Sweet' })
  @ApiQuery({ name: 'minPrice', required: false, example: 30000 })
  @ApiQuery({ name: 'maxPrice', required: false, example: 100000 })
  @ApiResponse({
    status: 200,
    description: 'List of menu items retrieved successfully',
  })
  findAllMenuItems(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.menusService.findAllMenuItems({
      search,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created successfully' })
  createMenuItem(@Body() body: CreateMenuItemDto) {
    return this.menusService.createMenuItem(body);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update menu item' })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  updateMenuItem(@Param('id') id: string, @Body() body: UpdateMenuItemDto) {
    return this.menusService.updateMenuItem(id, body);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete menu item' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new menu package' })
  @ApiResponse({
    status: 201,
    description: 'Menu package created successfully',
  })
  createMenuPackage(@Body() body: CreateMenuPackageDto) {
    return this.menusService.createMenuPackage(body);
  }

  @Patch('packages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update menu package' })
  @ApiResponse({
    status: 200,
    description: 'Menu package updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Menu package not found' })
  updateMenuPackage(
    @Param('id') id: string,
    @Body() body: UpdateMenuPackageDto,
  ) {
    return this.menusService.updateMenuPackage(id, body);
  }

  @Delete('packages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete menu package' })
  @ApiResponse({
    status: 200,
    description: 'Menu package deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Menu package not found' })
  removeMenuPackage(@Param('id') id: string) {
    return this.menusService.removeMenuPackage(id);
  }
}
