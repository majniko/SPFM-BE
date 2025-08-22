import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { IdentityModule } from '@identity/identity.module';
import { FinanceModule } from '@finance/finance.module';

@Module({
  imports: [
    CoreModule,
    IdentityModule,
    FinanceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}