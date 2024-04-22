import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './config/prisma/prisma.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './common/interceptors/user.interceptor';
import { ValidationFilter } from './common/filters/exceptions.filter';
import { UsersModule } from './features/users/users.module';
import { CompanyModule } from './features/company/company.module';

@Module({
  imports: [UsersModule, PrismaModule, CompanyModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
  ],
})
export class AppModule {}
