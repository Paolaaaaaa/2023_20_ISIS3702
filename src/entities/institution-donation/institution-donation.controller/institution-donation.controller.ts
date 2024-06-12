/* eslint-disable prettier/prettier */
import { InstitutionDonationService } from "../institution-donation.service/institution-donation.service";
import { Controller, UseInterceptors, Param, Get, Put, Body,Post,HttpCode,Delete, UseGuards } from "@nestjs/common";
import { SaleEntity } from "../../sale/sale.entity/sale.entity";
import { SaleDTO } from "../../sale/sale.dto/sale.dto";
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from "../../../shared/interceptors/business-errors.interceptors";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller('institutions')
@UseInterceptors(BusinessErrorsInterceptor)
export class InstitutionDonationController{
    constructor(private readonly institutionDonationService: InstitutionDonationService){}
    

    @UseGuards(JwtAuthGuard)
    @Get('/:institutionId/donations')
    async findDonationsByInstitutionId(@Param('institutionId') institutionId:string){
        return await this.institutionDonationService.findDonationsByinstitutionId(institutionId);
    }
    @UseGuards(JwtAuthGuard)
    @Get('/:institutionId/donations/:saleId')
    async findDonationByInstitutionId(@Param('institutionId') institutionId:string,@Param('saleId') donationId:string){
        return await this.institutionDonationService.findDonationByinstitutionIddonationId(institutionId,donationId);
    }
    @UseGuards(JwtAuthGuard)
    @Post(':institutionId/donations/')
   async addArtworkMuseum(@Param('institutionId') institutionId: string, @Body() donation: SaleDTO){
       return await this.institutionDonationService.addDonationInstitution(institutionId, donation);
   }

   @UseGuards(JwtAuthGuard)
   @Put(':institutionId/donations')
   async associateDonationsInstitution(@Body() dontationDto: SaleDTO[], @Param('institutionId') institutionId: string){
       const donations = plainToInstance(SaleEntity, dontationDto)
       return await this.institutionDonationService.associateDonationsinstitution(institutionId, donations);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':institutionId/donations/:donationId')
   @HttpCode(204)
   async deleteArtworkMuseum(@Param('institutionId') institutionId: string, @Param('donationId') donationId: string){
       return await this.institutionDonationService.deleteDonationinstitution(institutionId, donationId);
   }




}




  