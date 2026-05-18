jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: class {},
}));

jest.mock('./menus.service', () => ({
  MenusService: jest.fn(),
}));

const { MenusController } = require('./menus.controller');

describe('MenusController', () => {
  let controller: any;

  const menusServiceMock = {
    findAllMenuItems: jest.fn(),
    findOneMenuItem: jest.fn(),
    createMenuItem: jest.fn(),
    updateMenuItem: jest.fn(),
    removeMenuItem: jest.fn(),
    findAllMenuPackages: jest.fn(),
    findOneMenuPackage: jest.fn(),
    createMenuPackage: jest.fn(),
    updateMenuPackage: jest.fn(),
    removeMenuPackage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new MenusController(menusServiceMock);
  });

  it('finds all menu items', async () => {
    menusServiceMock.findAllMenuItems.mockResolvedValue([]);

    const result = await controller.findAllMenuItems(
      'tea',
      'drink',
      '10000',
      '50000',
    );

    expect(result).toEqual([]);
  });

  it('finds one menu item', async () => {
    menusServiceMock.findOneMenuItem.mockResolvedValue({ id: 'menu-1' });

    const result = await controller.findOneMenuItem('menu-1');

    expect(result.id).toBe('menu-1');
  });

  it('creates menu item', async () => {
    menusServiceMock.createMenuItem.mockResolvedValue({ id: 'menu-1' });

    const result = await controller.createMenuItem({ name: 'Tea' });

    expect(result.id).toBe('menu-1');
  });

  it('updates menu item', async () => {
    menusServiceMock.updateMenuItem.mockResolvedValue({
      name: 'Updated Tea',
    });

    const result = await controller.updateMenuItem('menu-1', {
      name: 'Updated Tea',
    });

    expect(result.name).toBe('Updated Tea');
  });

  it('removes menu item', async () => {
    menusServiceMock.removeMenuItem.mockResolvedValue({
      status: 'unavailable',
    });

    const result = await controller.removeMenuItem('menu-1');

    expect(result.status).toBe('unavailable');
  });

  it('finds all menu packages', async () => {
    menusServiceMock.findAllMenuPackages.mockResolvedValue([]);

    const result = await controller.findAllMenuPackages();

    expect(result).toEqual([]);
  });

  it('finds one menu package', async () => {
    menusServiceMock.findOneMenuPackage.mockResolvedValue({
      id: 'package-1',
    });

    const result = await controller.findOneMenuPackage('package-1');

    expect(result.id).toBe('package-1');
  });

  it('creates menu package', async () => {
    menusServiceMock.createMenuPackage.mockResolvedValue({
      id: 'package-1',
    });

    const result = await controller.createMenuPackage({
      name: 'Package',
    });

    expect(result.id).toBe('package-1');
  });

  it('updates menu package', async () => {
    menusServiceMock.updateMenuPackage.mockResolvedValue({
      name: 'Updated Package',
    });

    const result = await controller.updateMenuPackage('package-1', {
      name: 'Updated Package',
    });

    expect(result.name).toBe('Updated Package');
  });

  it('removes menu package', async () => {
    menusServiceMock.removeMenuPackage.mockResolvedValue({
      status: 'unavailable',
    });

    const result = await controller.removeMenuPackage('package-1');

    expect(result.status).toBe('unavailable');
  });
});
