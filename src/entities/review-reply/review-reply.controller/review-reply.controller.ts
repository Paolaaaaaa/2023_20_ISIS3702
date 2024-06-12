/* eslint-disable prettier/prettier */
import { BusinessErrorsInterceptor } from "../../../shared/interceptors/business-errors.interceptors";
import { Controller, UseInterceptors, Param, Get, Put, Body,Post,HttpCode,Delete, UseGuards } from "@nestjs/common";
import { plainToInstance } from 'class-transformer';
import { ReviewReplyService } from "../review-reply.service/review-reply.service";
import { ReviewEntity } from "src/entities/review/review.entity/review.entity";
import { ReplyDTO } from "../../review/review.dto/reply.dto";
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('reviews')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewReplyController{
    constructor(private readonly reviewReplyService: ReviewReplyService){}
    


    @Get('/:reviewId/replies')
    async findRepliesByReviewID(@Param('reviewId') reviewId:string){
        return await this.reviewReplyService.findRepliesByReviewId(reviewId);
    }

    @Get('/:reviewId/replies/:replyId')
    async findReplieByReviewID(@Param('reviewId') reviewId:string,@Param('replyId') replyId:string){
        return await this.reviewReplyService.findReplyByReviewIdReplyId(reviewId,replyId);
    }
    @UseGuards(JwtAuthGuard)
    @Post(':reviewId/replies/')
   async addReplyReview(@Param('reviewId') reviewId: string, @Body () reply: ReplyDTO){
       return await this.reviewReplyService.addReplyReview(reviewId, reply);
   }

   @UseGuards(JwtAuthGuard)
   @Put(':reviewId/replies/:replyId')
   async updateReplyReview(
     @Param('reviewId') reviewId: string,
     @Param('replyId') replyId: string,
     @Body() reply: ReplyDTO,
   ) {
     return await this.reviewReplyService.updateReplyReview(reviewId, replyId, reply);
   }
   

    @Put(':reviewId/replies')
   async associateRepliesReview(@Body() saleDTO: ReplyDTO[], @Param('reviewId') reviewId: string){
       const replies = plainToInstance(ReviewEntity, saleDTO)
       return await this.reviewReplyService.associateRepliesReview(reviewId, replies);
   }

   @Delete(':reviewId/replies/:replyId')
   @HttpCode(204)
   async deleteReplyReview(@Param('reviewId') reviewId: string, @Param('replyId') replyId: string){
       return await this.reviewReplyService.deleteReplyReview(reviewId, replyId);
   }




}




  