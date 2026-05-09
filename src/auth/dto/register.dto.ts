import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Customer One' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'customer1@mail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Tokyo' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '1995-01-01' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}
