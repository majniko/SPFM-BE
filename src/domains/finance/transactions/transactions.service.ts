import { Injectable, InternalServerErrorException } from '@nestjs/common';
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