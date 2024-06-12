import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionEntity } from '../institution.entity/institution.entity';
import { InstitutionDonationService } from '../../institution-donation/institution-donation.service/institution-donation.service';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { UserEntity } from '../../user/user.entity/user.entity';
import { InstitutionController } from '../institution.controller/institution.controller';
import { InstitutionService } from '../institution.service/institution.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstitutionEntity, SaleEntity, UserEntity]),
  ],
  providers: [InstitutionService],
  controllers: [InstitutionController],
})
export class InstitutionModule {}
