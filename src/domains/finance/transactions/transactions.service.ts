import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@core/prisma';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  findAllByUserId(userId: string) {
    return this.prisma.transactions.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const { title, amount, isExpense, categoryId, date } = createTransactionDto;

    const category = await this.prisma.categories.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      throw new NotFoundException('category_not_found');
    }

    try {
      await this.prisma.transactions.create({
        data: {
          title,
          amount,
          isExpense,
          categoryId,
          date: new Date(date),
          userId,
        },
      });
      return { message: 'transaction_created' };
    } catch (e) {
      throw new InternalServerErrorException('unexpected_prisma_error');
    }
  }
}
