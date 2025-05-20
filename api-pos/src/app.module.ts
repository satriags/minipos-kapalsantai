import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
