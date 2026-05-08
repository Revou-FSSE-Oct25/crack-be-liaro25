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

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('items')
  findAllMenuItems() {
    return this.menusService.findAllMenuItems();
  }

  @Get('items/:id')
  findOneMenuItem(@Param('id') id: string) {
    return this.menusService.findOneMenuItem(id);
  }

  @Post('items')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeMenuItem(@Param('id') id: string) {
    return this.menusService.removeMenuItem(id);
  }

  @Get('packages')
  findAllMenuPackages() {
    return this.menusService.findAllMenuPackages();
  }

  @Get('packages/:id')
  findOneMenuPackage(@Param('id') id: string) {
    return this.menusService.findOneMenuPackage(id);
  }

  @Post('packages')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeMenuPackage(@Param('id') id: string) {
    return this.menusService.removeMenuPackage(id);
  }
}