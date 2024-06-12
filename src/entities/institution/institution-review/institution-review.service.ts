import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstitutionEntity } from '../institution.entity/institution.entity';
import { ReviewEntity } from '../../review/review.entity/review.entity';

import {
    BusinessError,
    BusinessLogicException,
  } from '../../../shared/errors/business-errors';

@Injectable()
export class InstitutionReviewService {
  constructor(
    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async getReviewsForInstitution(institutionId: string): Promise<ReviewEntity[]> {
    const institution: InstitutionEntity = await this.institutionRepository.findOne({
      where: { id: institutionId },
      relations: ['reviews'],
    });
    if (!institution) {
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return institution.reviews;
  }

  async getReviewFromInstitution(institutionId: string, reviewId: string): Promise<ReviewEntity> {
    const institution: InstitutionEntity = await this.institutionRepository.findOne({
      where: { id: institutionId },
      relations: ['reviews'],
    });

    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!institution) {
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  
  
    return review;
  }
  
  async addReviewToInstitution(institutionId: string, reviewId: string): Promise<ReviewEntity> {
    const institution: InstitutionEntity = await this.institutionRepository.findOne({
      where: { id: institutionId },
      relations: ['reviews'],
    });

    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!institution) {
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  

    const savedReview: ReviewEntity = await this.reviewRepository.save(review);
    institution.reviews.push(savedReview);
    await this.institutionRepository.save(institution);
  
    return savedReview;
  }



  async associateReviewsToInstitution(
    institutionId: string,
    reviews: ReviewEntity[],
  ): Promise<InstitutionEntity> {
    const institution: InstitutionEntity = await this.institutionRepository.findOne({
      where: { id: institutionId },
      relations: ['reviews'],
    });
  
    if (!institution) {
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  

    
  
    institution.reviews = reviews;
  
    return await this.institutionRepository.save(institution);
  }

  
  async deleteReviewFromInstitution(institutionId: string, reviewId: string) {
    const institution: InstitutionEntity = await this.institutionRepository.findOne({
      where: { id: institutionId },
      relations: ['reviews'],
    });
  
    if (!institution) {
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  
    const reviewIndex: number = institution.reviews.findIndex((e) => e.id === reviewId);
  
    if (reviewIndex === -1) {
      throw new BusinessLogicException(
        'The review with the given id is not associated with the institution',
        BusinessError.PRECONDITION_FAILED,
      );
    }
  
    institution.reviews.splice(reviewIndex, 1);
    await this.institutionRepository.save(institution);
  }
  
  
}
