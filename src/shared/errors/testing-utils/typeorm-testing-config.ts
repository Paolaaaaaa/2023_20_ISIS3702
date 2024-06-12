/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionEntity } from '../../../entities/institution/institution.entity/institution.entity';
import { PetEntity } from '../../../entities/pet/pet.entity/pet.entity';
import { UserEntity } from '../../../entities/user/user.entity/user.entity';
import { ReviewEntity } from '../../../entities/review/review.entity/review.entity';
import { SaleEntity } from '../../../entities/sale/sale.entity/sale.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [InstitutionEntity, PetEntity, UserEntity,ReviewEntity,SaleEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([InstitutionEntity, PetEntity, UserEntity,ReviewEntity,SaleEntity]),
];
