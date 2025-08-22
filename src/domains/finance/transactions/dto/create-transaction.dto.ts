import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsBoolean,
    IsISO8601,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
    @ApiProperty({
        example: 'Dinner with friends',
        description: 'Title of the transaction',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 59.99,
        description: 'Amount of the transaction',
    })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({
        example: true,
        description: 'True if an expense, false if an income',
    })
    @IsBoolean()
    isExpense: boolean;

    @ApiProperty({
        example: 'your-category-id',
        description: 'The ID of the category this transaction belongs to',
    })
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({
        example: '2024-08-15T10:30:00.000Z',
        description: 'Date of the transaction in ISO 8601 format',
    })
    @IsISO8601()
    date: string;
}