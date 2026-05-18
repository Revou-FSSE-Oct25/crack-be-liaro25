jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: class {},
  Role: {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
  },
}));

jest.mock('./auth.service', () => ({
  AuthService: jest.fn(),
}));

const { AuthController } = require('./auth.controller');

describe('AuthController', () => {
  let controller: any;

  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(authServiceMock);
  });

  it('registers user', async () => {
    authServiceMock.register.mockResolvedValue({
      message: 'Registration successful',
    });

    const result = await controller.register({
      name: 'Lia',
      email: 'lia@mail.com',
      password: 'password123',
    });

    expect(authServiceMock.register).toHaveBeenCalled();
    expect(result.message).toBe('Registration successful');
  });

  it('logs in user and sets cookie', async () => {
    authServiceMock.login.mockResolvedValue({
      accessToken: 'jwt-token',
      user: { id: 'user-1' },
    });

    const responseMock = {
      cookie: jest.fn(),
    };

    const result = await controller.login(
      {
        email: 'lia@mail.com',
        password: 'password123',
      },
      responseMock,
    );

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(responseMock.cookie).toHaveBeenCalled();
    expect(result.user.id).toBe('user-1');
  });

  it('logs out user by clearing cookie', () => {
    const responseMock = {
      clearCookie: jest.fn(),
    };

    const result = controller.logout(responseMock);

    expect(responseMock.clearCookie).toHaveBeenCalledWith('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    expect(result.message).toBe('Logout successful');
  });
});
