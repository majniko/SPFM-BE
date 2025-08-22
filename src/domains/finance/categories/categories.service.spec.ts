import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '@core/prisma';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    categories: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Groceries',
    };
    const userId = 'user-123';

    it('should create a new category successfully', async () => {
      mockPrismaService.categories.findFirst.mockResolvedValue(null);
      
      mockPrismaService.categories.create.mockResolvedValue({
        id: 'cat-1',
        name: createCategoryDto.name,
        userId,
      });

      const result = await service.create(createCategoryDto, userId);

      expect(result).toEqual({ message: 'category_created' });
      expect(mockPrismaService.categories.findFirst).toHaveBeenCalledWith({
        where: {
          name: createCategoryDto.name,
          userId,
        },
      });
      expect(mockPrismaService.categories.create).toHaveBeenCalledWith({
        data: {
          name: createCategoryDto.name,
          userId,
        },
      });
    });

    it('should throw ConflictException when category already exists', async () => {
      mockPrismaService.categories.findFirst.mockResolvedValue({
        id: 'cat-1',
        name: createCategoryDto.name,
        userId,
      });

      await expect(service.create(createCategoryDto, userId)).rejects.toThrow(ConflictException);
      await expect(service.create(createCategoryDto, userId)).rejects.toThrow('category_exists');
      expect(mockPrismaService.categories.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when prisma create fails', async () => {
      mockPrismaService.categories.findFirst.mockResolvedValue(null);
      
      const error = new Error('Database error');
      mockPrismaService.categories.create.mockRejectedValue(error);

      await expect(service.create(createCategoryDto, userId)).rejects.toThrow(InternalServerErrorException);
      await expect(service.create(createCategoryDto, userId)).rejects.toThrow('unexpected_prisma_error');
    });
  });

  describe('findAll', () => {
    it('should return all categories for a user', async () => {
      const userId = 'user-123';
      const mockCategories = [
        { id: 'cat-1', name: 'Groceries', userId },
        { id: 'cat-2', name: 'Salary', userId },
      ];
      
      mockPrismaService.categories.findMany.mockResolvedValue(mockCategories);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.categories.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Updated Groceries',
    };
    const categoryId = 'cat-1';
    const userId = 'user-123';

    it('should update a category successfully', async () => {
      mockPrismaService.categories.findFirst.mockResolvedValue(null);
      
      mockPrismaService.categories.update.mockResolvedValue({
        id: categoryId,
        name: updateCategoryDto.name,
        userId,
      });

      const result = await service.update(categoryId, updateCategoryDto, userId);

      expect(result).toEqual({ message: 'category_updated' });
      expect(mockPrismaService.categories.findFirst).toHaveBeenCalledWith({
        where: {
          name: updateCategoryDto.name,
          userId,
          id: { not: categoryId },
        },
      });
      expect(mockPrismaService.categories.update).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          userId,
        },
        data: {
          name: updateCategoryDto.name,
        },
      });
    });

    it('should throw ConflictException when category with the same name already exists', async () => {
      mockPrismaService.categories.findFirst.mockResolvedValue({
        id: 'cat-2',
        name: updateCategoryDto.name,
        userId,
      });

      await expect(service.update(categoryId, updateCategoryDto, userId)).rejects.toThrow(ConflictException);
      await expect(service.update(categoryId, updateCategoryDto, userId)).rejects.toThrow('category_exists');
      expect(mockPrismaService.categories.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when category is not found', async () => {
      mockPrismaService.categories.findFirst.mockResolvedValue(null);
      
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record to update not found',
        {
          code: 'P2025',
          clientVersion: '2.26.0',
        }
      );
      mockPrismaService.categories.update.mockRejectedValue(prismaError);

      await expect(service.update(categoryId, updateCategoryDto, userId)).rejects.toThrow(NotFoundException);
      await expect(service.update(categoryId, updateCategoryDto, userId)).rejects.toThrow('category_not_found');
    });

    it('should throw InternalServerErrorException for other prisma errors', async () => {
      mockPrismaService.categories.findFirst.mockResolvedValue(null);
      
      const error = new Error('Database error');
      mockPrismaService.categories.update.mockRejectedValue(error);

      await expect(service.update(categoryId, updateCategoryDto, userId)).rejects.toThrow(InternalServerErrorException);
      await expect(service.update(categoryId, updateCategoryDto, userId)).rejects.toThrow('unexpected_prisma_error');
    });
  });

  describe('remove', () => {
    const categoryId = 'cat-1';
    const userId = 'user-123';

    it('should remove a category successfully', async () => {
      mockPrismaService.categories.delete.mockResolvedValue({
        id: categoryId,
        name: 'Groceries',
        userId,
      });

      const result = await service.remove(categoryId, userId);

      expect(result).toEqual({ message: 'category_deleted' });
      expect(mockPrismaService.categories.delete).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          userId,
        },
      });
    });

    it('should throw NotFoundException when category is not found', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record to delete not found',
        {
          code: 'P2025',
          clientVersion: '2.26.0',
        }
      );
      mockPrismaService.categories.delete.mockRejectedValue(prismaError);

      await expect(service.remove(categoryId, userId)).rejects.toThrow(NotFoundException);
      await expect(service.remove(categoryId, userId)).rejects.toThrow('category_not_found');
    });

    it('should throw InternalServerErrorException for other prisma errors', async () => {
      const error = new Error('Database error');
      mockPrismaService.categories.delete.mockRejectedValue(error);

      await expect(service.remove(categoryId, userId)).rejects.toThrow(InternalServerErrorException);
      await expect(service.remove(categoryId, userId)).rejects.toThrow('unexpected_prisma_error');
    });
  });
});