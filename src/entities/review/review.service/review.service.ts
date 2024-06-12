import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../review.entity/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find();
  }

  async findOne(id: string): Promise<ReviewEntity> {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException('The review with the given id was not found');
    }
    return review;
  }

  async create(review: ReviewEntity): Promise<ReviewEntity> {
    review.replies=[];
    return await this.reviewRepository.save(review);
  }

  async update(id: string, review: ReviewEntity): Promise<ReviewEntity> {
    const existingReview: ReviewEntity = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!existingReview) {
      throw new NotFoundException('The review with the given id was not found');
    }

    return await this.reviewRepository.save({ ...existingReview, ...review });
  }

  async delete(id: string) {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException('The review with the given id was not found');
    }

    await this.reviewRepository.remove(review);
  }
}
