import { Module } from '@nestjs/common';
import { UsersModule } from '@identity/users/users.module';

import {AuthModule} from "@identity/auth/auth.module";
import { PrismaModule } from '@core/prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}