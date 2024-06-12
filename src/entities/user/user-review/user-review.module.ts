import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from 'src/entities/pet/pet.entity/pet.entity';
import { InstitutionEntity } from 'src/entities/institution/institution.entity/institution.entity';

import { UserEntity } from '../user.entity/user.entity';
import { ReviewEntity } from 'src/entities/review/review.entity/review.entity';
import { UserReviewService } from './user-review.service';
import { UserReviewController } from './user-review.controller';

@Module({
  providers: [UserReviewService],
  imports: [TypeOrmModule.forFeature([UserEntity, ReviewEntity])],
  controllers: [UserReviewController],
})
export class UserReviewModule {}