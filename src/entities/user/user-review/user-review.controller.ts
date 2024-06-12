/* eslint-disable prettier/prettier */
import { UserReviewService } from "./user-review.service";
import { Controller, UseInterceptors, Param, Get, Put, Body, Post, HttpCode, Delete, UseGuards } from "@nestjs/common";
import { ReviewEntity } from "../../review/review.entity/review.entity";
import { BusinessErrorsInterceptor } from "../../../shared/interceptors/business-errors.interceptors";
import { LocalAuthGuard } from "src/entities/auth/guards/local-auth.guard";

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserReviewController {
    constructor(private readonly userReviewService: UserReviewService) {}

    @Get('/:userId/reviews')
    async findReviewsByUserId(@Param('userId') userId: string) {
        return await this.userReviewService.getReviewsForUser(userId);
    }
    @Get('/:userId/reviews/:reviewId')
    async findReviewForUser(@Param('userId') userId: string,@Param('reviewId') reviewId: string) {
        return await this.userReviewService.getReviewForUser(userId,reviewId);
    }

    @Post('/:userId/reviews/:reviewId')
    async addReviewToUser(@Param('userId') userId: string, @Param('reviewId') reviewId: string) {
        return await this.userReviewService.addReviewToUser(userId, reviewId);
    }

    @Put('/:userId/reviews')
    async associateReviewsToUser(@Param('userId') userId: string, @Body() reviews: ReviewEntity[]) {
        return await this.userReviewService.associateReviewsToUser(userId, reviews);
    }

    @Delete('/:userId/reviews/:reviewId')
    @HttpCode(204)
    async deleteReviewFromUser(@Param('userId') userId: string, @Param('reviewId') reviewId: string) {
        return await this.userReviewService.deleteReviewFromUser(userId, reviewId);
    }
}
