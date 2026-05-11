import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new customer account' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Email already registered',
  })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and set HttpOnly cookie' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: result.message,
      user: result.user,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear cookie' })
  logout(@Res({ passthrough: true }) res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    return {
      message: 'Logout successful',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged in user' })
  async me(@Request() req: any) {
    const user = await this.authService.getProfile(req.user.userId);

    return {
      user,
    };
  }
}
