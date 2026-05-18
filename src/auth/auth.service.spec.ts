import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('bcrypt');

const { AuthService } = require('./auth.service');

describe('AuthService', () => {
  let service: any;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prismaMock as any,
      jwtServiceMock as unknown as JwtService,
    );
  });

  describe('register', () => {
    it('registers a new user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const createdUser = {
        id: 'user-1',
        name: 'Lia',
        email: 'lia@mail.com',
        phone: '123',
        address: 'Tokyo',
        dateOfBirth: new Date('1990-01-01'),
        role: 'CUSTOMER',
        createdAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(createdUser);

      const result = await service.register({
        name: ' Lia ',
        email: ' LIA@MAIL.COM ',
        password: 'password123',
        phone: ' 123 ',
        address: ' Tokyo ',
        dateOfBirth: '1990-01-01',
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'lia@mail.com' },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Registration successful',
        user: createdUser,
      });
    });

    it('throws BadRequestException when email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-user' });

      await expect(
        service.register({
          name: 'Lia',
          email: 'lia@mail.com',
          password: 'password123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('login', () => {
    it('logs in user successfully', async () => {
      const user = {
        id: 'user-1',
        name: 'Lia',
        email: 'lia@mail.com',
        password: 'hashed-password',
        phone: '123',
        role: 'CUSTOMER',
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtServiceMock.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login({
        email: ' LIA@MAIL.COM ',
        password: 'password123',
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'lia@mail.com' },
      });

      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      expect(result.accessToken).toBe('jwt-token');
      expect(result.user.email).toBe('lia@mail.com');
    });

    it('throws UnauthorizedException when user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'wrong@mail.com',
          password: 'password123',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is invalid', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'lia@mail.com',
        password: 'hashed-password',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'lia@mail.com',
          password: 'wrong-password',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  it('gets user profile', async () => {
    const profile = {
      id: 'user-1',
      name: 'Lia',
      email: 'lia@mail.com',
    };

    prismaMock.user.findUnique.mockResolvedValue(profile);

    const result = await service.getProfile('user-1');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: expect.any(Object),
    });
    expect(result).toEqual(profile);
  });
});
