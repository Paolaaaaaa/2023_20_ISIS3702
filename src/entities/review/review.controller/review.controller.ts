import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors/business-errors.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReviewEntity } from '../review.entity/review.entity';
import { ReviewService } from '../review.service/review.service';
import { ReviewDTO } from '../review.dto/review.dto';
import { ReplyDTO } from '../review.dto/reply.dto';

@Controller('reviews')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async findAll() {
    return await this.reviewService.findAll();
  }

  @Get(':reviewId')
  async findById(@Param('reviewId') reviewId: string) {
    return await this.reviewService.findOne(reviewId);
  }

  @Post()
  async create(@Body() reviewDto: ReviewDTO) {
    const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
    return await this.reviewService.create(review);
  }

  @Post('/reply')
  async create_reply(@Body() reviewDto: ReplyDTO) {
    const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
    return await this.reviewService.create(review);
  }

  @Put(':reviewId')
  async update(
    @Param('reviewId') reviewId: string,
    @Body() reviewDto: ReviewDTO,
  ) {
    const review: ReviewEntity = plainToInstance(ReviewEntity, reviewDto);
    return await this.reviewService.update(reviewId, review);
  }

  @Delete(':reviewId')
  @HttpCode(204)
  async delete(@Param('reviewId') reviewId: string) {
    return await this.reviewService.delete(reviewId);
  }
}
