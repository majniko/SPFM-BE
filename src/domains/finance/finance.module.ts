import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import {CategoriesModule} from "@finance/categories/categories.module";

@Module({
    imports: [TransactionsModule, CategoriesModule],
    exports: [TransactionsModule, CategoriesModule],
})
export class FinanceModule {}
