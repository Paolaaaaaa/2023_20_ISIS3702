/* eslint-disable prettier/prettier */
import { InstitutionReviewService } from "./institution-review.service";
import { Controller, UseInterceptors, Param, Get, Put, Body, Post, HttpCode, Delete, UseGuards } from "@nestjs/common";
import { ReviewEntity } from "../../review/review.entity/review.entity";
import { BusinessErrorsInterceptor } from "../../../shared/interceptors/business-errors.interceptors";
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';


@Controller('institutions')
@UseInterceptors(BusinessErrorsInterceptor)
export class InstitutionReviewController {
    constructor(private readonly institutionReviewService: InstitutionReviewService) {}
    @Get('/:institutionId/reviews')
    async findReviewsByInstitutionId(@Param('institutionId') institutionId: string) {
        return await this.institutionReviewService.getReviewsForInstitution(institutionId);
    }
    @Get('/:institutionId/reviews/:reviewId')
    async findReviewssByInstitutionId(@Param('institutionId') institutionId: string, @Param('reviewId') reviewId: string) {
        return await this.institutionReviewService.getReviewFromInstitution(institutionId,reviewId);
    }
    @Post('/:institutionId/reviews/:reviewId')
    async addReviewToInstitution(@Param('institutionId') institutionId: string, @Param('reviewId') reviewId: string) {
        return await this.institutionReviewService.addReviewToInstitution(institutionId, reviewId);
    }
    @Put('/:institutionId/reviews')
    async associateReviewsToInstitution(@Param('institutionId') institutionId: string, @Body() reviews: ReviewEntity[]) {
        return await this.institutionReviewService.associateReviewsToInstitution(institutionId, reviews);
    }
    @Delete('/:institutionId/reviews/:reviewId')
    @HttpCode(204)
    async deleteReviewFromInstitution(@Param('institutionId') institutionId: string, @Param('reviewId') reviewId: string) {
        return await this.institutionReviewService.deleteReviewFromInstitution(institutionId, reviewId);
    }
}
