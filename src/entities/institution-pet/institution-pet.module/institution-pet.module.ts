import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from 'src/entities/pet/pet.entity/pet.entity';
import { InstitutionEntity } from 'src/entities/institution/institution.entity/institution.entity';
import { InstitutionPetService } from '../institution-pet.service/institution-pet.service';
import { InstitutionPetController } from '../institution-pet.controller/institution-pet.controller';

@Module({
  providers: [InstitutionPetService],
  imports: [TypeOrmModule.forFeature([InstitutionEntity, PetEntity])],
  controllers: [InstitutionPetController],
})
export class InstitutionPetModule {}