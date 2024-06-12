import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../../review/review.entity/review.entity';

import { InstitutionEntity } from '../institution.entity/institution.entity';
import { InstitutionReviewService } from './institution-review.service';
import { InstitutionReviewController } from './institution-review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InstitutionEntity,ReviewEntity])],
  providers: [InstitutionReviewService],
  controllers: [InstitutionReviewController],
})
export class InstitutionReviewModule {}