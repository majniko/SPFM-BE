import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, InternalServerErrorException } from '@nestjs/common';

import { AuthGuard } from '@identity/auth/auth.guard';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;

  const mockTransactionsService = {
    findAllByUserId: jest.fn(),
    create: jest.fn(),
  };

  const mockAuthGuard: CanActivate = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const userId = 'user-123';
      const mockTransactions = [
        {
          id: '1',
          title: 'Groceries',
          amount: 50,
          isExpense: true,
          categoryId: 'cat-1',
          date: new Date(),
          userId,
        },
        {
          id: '2',
          title: 'Salary',
          amount: 1000,
          isExpense: false,
          categoryId: 'cat-2',
          date: new Date(),
          userId,
        },
      ];

      mockTransactionsService.findAllByUserId.mockResolvedValue(
        mockTransactions,
      );

      const result = await controller.findAll(userId);

      expect(result).toEqual(mockTransactions);
      expect(transactionsService.findAllByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    const createTransactionDto: CreateTransactionDto = {
      title: 'Groceries',
      amount: 50,
      isExpense: true,
      categoryId: 'cat-1',
      date: '2023-01-01T12:00:00Z',
    };
    const userId = 'user-123';

    it('should create a new transaction successfully', async () => {
      const expectedResult = { message: 'transaction_created' };
      mockTransactionsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTransactionDto, userId);

      expect(result).toEqual(expectedResult);
      expect(transactionsService.create).toHaveBeenCalledWith(
        createTransactionDto,
        userId,
      );
    });

    it('should pass through errors from service', async () => {
      const error = new InternalServerErrorException('unexpected_prisma_error');
      mockTransactionsService.create.mockRejectedValue(error);

      await expect(
        controller.create(createTransactionDto, userId),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        controller.create(createTransactionDto, userId),
      ).rejects.toThrow('unexpected_prisma_error');
    });
  });
});
