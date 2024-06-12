import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import { ReviewReplyService } from '../review-reply.service/review-reply.service';
import { ReviewReplyController } from '../review-reply.controller/review-reply.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
  providers: [ReviewReplyService],
  controllers: [ReviewReplyController],
})
export class ReviewReplyModule {}

