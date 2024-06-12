import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity/user.entity';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { UserSaleService } from './user_sale.service';
import { UserSaleController } from './user_sale.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, SaleEntity]),
  ],
  providers: [UserSaleService],
  exports: [UserSaleService],
  controllers: [UserSaleController]
})
export class UserSaleModule {}
