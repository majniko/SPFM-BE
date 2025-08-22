import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@identity/auth/auth.guard';
import { User } from '@identity/auth/decorators/user.decorator';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all transactions for the logged-in user' })
    @ApiResponse({ status: 200, description: 'Returns an array of transactions.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    findAll(@User('sub') userId: string) {
        return this.transactionsService.findAllByUserId(userId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('create')
    @ApiOperation({ summary: 'Create a new transaction for the logged-in user' })
    @ApiResponse({ status: 201, description: 'The transaction has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    create(
        @Body() createTransactionDto: CreateTransactionDto,
        @User('sub') userId: string,
    ) {
        return this.transactionsService.create(createTransactionDto, userId);
    }
}