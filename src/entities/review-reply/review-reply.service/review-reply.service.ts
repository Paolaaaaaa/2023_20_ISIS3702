import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { classToPlain } from 'class-transformer';

@Injectable()
export class ReviewReplyService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async addReplyReview(reviewId: string, reply): Promise<Record<string, any>> {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['replies'],
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (!reply.review)
      throw new BusinessLogicException(
        'The reply is not valid',
        BusinessError.PRECONDITION_FAILED,
      );

    const re_rply = review;

    reply.parentReview = review;
    const sav_repy = await this.reviewRepository.save(reply);
    re_rply.replies = [...review.replies, sav_repy];

    const reply_res: ReviewEntity = await this.reviewRepository.save({
      ...review,
      re_rply,
    }); // Guarda la respuesta por separado

    return classToPlain(reply_res, { excludePrefixes: ['parentReview'] });
  }

  async updateReplyReview(
    reviewId: string,
    replyId: string,
    reply,
  ): Promise<Record<string, any>> {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['replies'],
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const str_reply: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: replyId },
      relations: ['parentReview'],
    });
    if (!str_reply)
      throw new BusinessLogicException(
        'The reply with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    str_reply.review = reply.review;
    str_reply.time = reply.time;

    const sav_repy = await this.reviewRepository.save(str_reply);

    return sav_repy;
  }

  async findReplyByReviewIdReplyId(
    reviewId: string,
    replyId: string,
  ): Promise<ReviewEntity> {
    const reply: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: replyId },
    });
    if (!reply)
      throw new BusinessLogicException(
        'The reply with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['replies', 'parentReview'],
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    let reviewReply: ReviewEntity = null;
    console.log(review.replies);
    console.log(reply.id);
    for (let index = 0; index < review.replies.length; index++) {
      if (review.replies[index].id == reply.id) {
        reviewReply = review.replies[index];
        break;
      }
    }

    if (!reviewReply)
      throw new BusinessLogicException(
        'The reply with the given id is not associated to the review',
        BusinessError.PRECONDITION_FAILED,
      );

    return reviewReply;
  }

  async findRepliesByReviewId(reviewId: string): Promise<ReviewEntity[]> {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['replies', 'parentReview'],
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return review.replies;
  }

  async associateRepliesReview(
    reviewId: string,
    replies: ReviewEntity[],
  ): Promise<ReviewEntity> {
    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < replies.length; i++) {
      const reply: ReviewEntity = await this.reviewRepository.findOne({
        where: { id: replies[i].id },
      });
      if (!reply)
        throw new BusinessLogicException(
          'The reply with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    review.replies = replies;
    return await this.reviewRepository.save(review);
  }

  async deleteReplyReview(reviewId: string, replyId: string) {
    const reply: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: replyId },
    });
    if (!reply)
      throw new BusinessLogicException(
        'The reply with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const review: ReviewEntity = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['replies', 'parentReview'],
    });
    if (!review)
      throw new BusinessLogicException(
        'The review with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const reviewReply: ReviewEntity = review.replies.find(
      (e) => e.id == reply.id,
    );

    if (!reviewReply)
      throw new BusinessLogicException(
        'The reply with the given id is not associated to the review',
        BusinessError.PRECONDITION_FAILED,
      );

    review.replies = review.replies.filter((e) => e.id !== replyId);
    await this.reviewRepository.save(review);
  }
}
