import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, ConflictException, NotFoundException } from '@nestjs/common';

import { AuthGuard } from '@identity/auth/auth.guard';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthGuard: CanActivate = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Groceries',
    };
    const userId = 'user-123';

    it('should create a new category successfully', async () => {
      const expectedResult = { message: 'category_created' };
      mockCategoriesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCategoryDto, userId);

      expect(result).toEqual(expectedResult);
      expect(categoriesService.create).toHaveBeenCalledWith(createCategoryDto, userId);
    });

    it('should pass through conflict exception from service', async () => {
      const error = new ConflictException('category_exists');
      mockCategoriesService.create.mockRejectedValue(error);

      await expect(controller.create(createCategoryDto, userId)).rejects.toThrow(ConflictException);
      await expect(controller.create(createCategoryDto, userId)).rejects.toThrow('category_exists');
    });
  });

  describe('findAll', () => {
    it('should return all categories for a user', async () => {
      const userId = 'user-123';
      const mockCategories = [
        { id: 'cat-1', name: 'Groceries', userId },
        { id: 'cat-2', name: 'Salary', userId },
      ];
      
      mockCategoriesService.findAll.mockResolvedValue(mockCategories);

      const result = await controller.findAll(userId);

      expect(result).toEqual(mockCategories);
      expect(categoriesService.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Updated Groceries',
    };
    const categoryId = 'cat-1';
    const userId = 'user-123';

    it('should update a category successfully', async () => {
      const expectedResult = { message: 'category_updated' };
      mockCategoriesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(categoryId, updateCategoryDto, userId);

      expect(result).toEqual(expectedResult);
      expect(categoriesService.update).toHaveBeenCalledWith(categoryId, updateCategoryDto, userId);
    });

    it('should pass through conflict exception from service', async () => {
      const error = new ConflictException('category_exists');
      mockCategoriesService.update.mockRejectedValue(error);

      await expect(controller.update(categoryId, updateCategoryDto, userId)).rejects.toThrow(ConflictException);
      await expect(controller.update(categoryId, updateCategoryDto, userId)).rejects.toThrow('category_exists');
    });

    it('should pass through not found exception from service', async () => {
      const error = new NotFoundException('category_not_found');
      mockCategoriesService.update.mockRejectedValue(error);

      await expect(controller.update(categoryId, updateCategoryDto, userId)).rejects.toThrow(NotFoundException);
      await expect(controller.update(categoryId, updateCategoryDto, userId)).rejects.toThrow('category_not_found');
    });
  });

  describe('remove', () => {
    const categoryId = 'cat-1';
    const userId = 'user-123';

    it('should remove a category successfully', async () => {
      const expectedResult = { message: 'category_deleted' };
      mockCategoriesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(categoryId, userId);

      expect(result).toEqual(expectedResult);
      expect(categoriesService.remove).toHaveBeenCalledWith(categoryId, userId);
    });

    it('should pass through not found exception from service', async () => {
      const error = new NotFoundException('category_not_found');
      mockCategoriesService.remove.mockRejectedValue(error);

      await expect(controller.remove(categoryId, userId)).rejects.toThrow(NotFoundException);
      await expect(controller.remove(categoryId, userId)).rejects.toThrow('category_not_found');
    });
  });
});