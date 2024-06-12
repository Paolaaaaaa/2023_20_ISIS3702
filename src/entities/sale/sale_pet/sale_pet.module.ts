import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleEntity } from '../sale.entity/sale.entity';
import { PetEntity } from '../../pet/pet.entity/pet.entity';
import { SalePetService } from './sale_pet.service';
import { SalePetController } from './sale_pet.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleEntity, PetEntity]),
  ],
  providers: [SalePetService],
  exports: [SalePetService],
  controllers: [SalePetController]
})
export class SalePetModule {}
