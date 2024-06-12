import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './entities/user/user.module/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user/user.entity/user.entity';
import { SaleEntity } from './entities/sale/sale.entity/sale.entity';
import { ReviewEntity } from './entities/review/review.entity/review.entity';
import { InstitutionEntity } from './entities/institution/institution.entity/institution.entity';
import { PetEntity } from './entities/pet/pet.entity/pet.entity';
import { SaleModule } from './entities/sale/sale.module';
import { ReviewModule } from './entities/review/review.module';
import { InstitutionModule } from './entities/institution/institution.module/institution.module';
import { PetModule } from './entities/pet/pet.module/pet.module';
import { InstitutionPetModule } from './entities/institution-pet/institution-pet.module/institution-pet.module';
import { SalePetModule } from './entities/sale/sale_pet/sale_pet.module';
import { UserSaleModule } from './entities/user/user_sale/user_sale.module';
import { ReviewReplyModule } from './entities/review-reply/review-reply.module/review-reply.module';
import { InstitutioDonationnModule } from './entities/institution-donation/institution-donation.module/institution-donation.module';
import { AuthoModule } from './entities/auth/auth.module/auth.module';
import { InstitutionReviewModule } from './entities/institution/institution-review/institution-review.module';
import { UserReviewModule } from './entities/user/user-review/user-review.module';

@Module({
  imports: [
    UserModule,
    SaleModule,
    ReviewModule,
    InstitutionModule,
    PetModule,
    ReviewReplyModule,
    InstitutioDonationnModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'houstier',
      entities: [
        UserEntity,
        SaleEntity,
        ReviewEntity,
        InstitutionEntity,
        PetEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    InstitutionPetModule,
    InstitutionReviewModule,
    UserReviewModule,
    SalePetModule,
    UserSaleModule,
    AuthoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}