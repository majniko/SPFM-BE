import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { IdentityModule } from '@identity/identity.module';
import { FinanceModule } from '@finance/finance.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CoreModule,
    IdentityModule,
    FinanceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}