import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@/core/prisma';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by username', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', pwdHash: 'hashed_password' };
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('testuser');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistentuser');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const createUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      mockPrismaService.users.create.mockResolvedValue({
        id: 1,
        username: createUserDto.username,
        email: createUserDto.email,
        pwdHash: 'hashed_password',
      });

      const result = await service.create(createUserDto);

      expect(result).toEqual({ message: 'user_created' });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.users.create).toHaveBeenCalledWith({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          pwdHash: 'hashed_password',
        },
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed on the fields: (`username`)',
          {
            code: 'P2002',
            clientVersion: '2.26.0', // This version string is required but can be any value
            meta: { target: ['username'] },
          },
      );
      mockPrismaService.users.create.mockRejectedValue(prismaError);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createUserDto)).rejects.toThrow('username_exists');
    });

    it('should throw ConflictException when email already exists', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed on the fields: (`email`)',
          {
            code: 'P2002',
            clientVersion: '2.26.0', // This version string is required but can be any value
            meta: { target: ['email'] },
          },
      );
      mockPrismaService.users.create.mockRejectedValue(prismaError);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createUserDto)).rejects.toThrow('email_exists');
    });

    it('should rethrow other errors', async () => {
      const otherError = new Error('Database connection failed');
      mockPrismaService.users.create.mockRejectedValue(otherError);

      await expect(service.create(createUserDto)).rejects.toThrow('Database connection failed');
    });
  });
});
