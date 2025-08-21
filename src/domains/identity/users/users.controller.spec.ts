import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      const expectedResult = { message: 'user_created' };
      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should pass through username conflict exception from service', async () => {
      mockUsersService.create.mockRejectedValue(new ConflictException('username_exists'));

      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(controller.create(createUserDto)).rejects.toThrow('username_exists');
    });

    it('should pass through email conflict exception from service', async () => {
      mockUsersService.create.mockRejectedValue(new ConflictException('email_exists'));

      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(controller.create(createUserDto)).rejects.toThrow('email_exists');
    });

    it('should pass through other errors from service', async () => {
      const error = new Error('Unexpected error');
      mockUsersService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow('Unexpected error');
    });
  });
});
