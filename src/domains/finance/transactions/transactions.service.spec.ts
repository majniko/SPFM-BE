import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '@core/prisma';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    transactions: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByUserId', () => {
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

      mockPrismaService.transactions.findMany.mockResolvedValue(
        mockTransactions,
      );

      const result = await service.findAllByUserId(userId);

      expect(result).toEqual(mockTransactions);
      expect(mockPrismaService.transactions.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { date: 'desc' },
      });
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
      mockPrismaService.transactions.create.mockResolvedValue({
        id: '1',
        title: createTransactionDto.title,
        amount: createTransactionDto.amount,
        isExpense: createTransactionDto.isExpense,
        categoryId: createTransactionDto.categoryId,
        date: new Date(createTransactionDto.date),
        userId,
      });

      const result = await service.create(createTransactionDto, userId);

      expect(result).toEqual({ message: 'transaction_created' });
      expect(mockPrismaService.transactions.create).toHaveBeenCalledWith({
        data: {
          title: createTransactionDto.title,
          amount: createTransactionDto.amount,
          isExpense: createTransactionDto.isExpense,
          categoryId: createTransactionDto.categoryId,
          date: expect.any(Date),
          userId,
        },
      });
    });

    it('should throw InternalServerErrorException when prisma create fails', async () => {
      const error = new Error('Database error');
      mockPrismaService.transactions.create.mockRejectedValue(error);

      await expect(
        service.create(createTransactionDto, userId),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        service.create(createTransactionDto, userId),
      ).rejects.toThrow('unexpected_prisma_error');
    });
  });
});
