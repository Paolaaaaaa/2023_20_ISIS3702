import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity/user.entity';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';

@Injectable()
export class UserReviewService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async getReviewsForUser(userId: string): Promise<ReviewEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reviews'],
    });
    if (!user) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return user.reviews;
  }

  async getReviewForUser(userId: string, reviewId: string): Promise<ReviewEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reviews'],
    });

    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },

    });
    if (!user) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }


    return review;
  }

  async addReviewToUser(userId: string, reviewId: string): Promise<ReviewEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reviews'],
    });

    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },

    });
    if (!user) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }


    const savedReview: ReviewEntity = await this.reviewRepository.save(review);
    user.reviews.push(savedReview);
    await this.userRepository.save(user);

    return savedReview;
  }

  async associateReviewsToUser(userId: string, reviews: ReviewEntity[]): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reviews'],
    });

    if (!user) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    

    user.reviews = reviews;

    return await this.userRepository.save(user);
  }

  async deleteReviewFromUser(userId: string, reviewId: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reviews'],
    });

    if (!user) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const reviewIndex: number = user.reviews.findIndex((e) => e.id === reviewId);

    if (reviewIndex === -1) {
      throw new BusinessLogicException(
        'The review with the given id is not associated with the user',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    user.reviews.splice(reviewIndex, 1);
    await this.userRepository.save(user);
  }
}
