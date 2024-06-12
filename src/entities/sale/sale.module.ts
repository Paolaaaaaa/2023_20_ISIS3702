import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleEntity } from './sale.entity/sale.entity';
import { SaleService } from './sale.service/sale.service';
import { UserEntity } from '../user/user.entity/user.entity';
import { SaleController } from './sale.controller/sale.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SaleEntity, UserEntity])],
  providers: [SaleService],
  controllers: [SaleController]
})
export class SaleModule {}
