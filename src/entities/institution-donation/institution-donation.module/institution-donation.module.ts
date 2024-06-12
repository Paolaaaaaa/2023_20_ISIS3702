import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
import { InstitutionDonationService } from '../institution-donation.service/institution-donation.service';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { UserEntity } from '../../user/user.entity/user.entity';
import { InstitutionDonationController } from '../institution-donation.controller/institution-donation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstitutionEntity, SaleEntity, UserEntity]),
  ],
  providers: [InstitutionDonationService],
  controllers: [InstitutionDonationController],

})
export class InstitutioDonationnModule {}
