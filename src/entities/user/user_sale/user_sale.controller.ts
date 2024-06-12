/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { SaleDTO } from '../../sale/sale.dto/sale.dto';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors.interceptors';
import { UserSaleService } from './user_sale.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserSaleController {
    constructor(private readonly userSaleService: UserSaleService){}

    @UseGuards(JwtAuthGuard)
    @Post(':userId/sales/:saleId')
    async addSaleUser(@Param('userId') userId: string, @Param('saleId') saleId: string){
        return await this.userSaleService.addSaleUser(userId, saleId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/sales/:saleId')
    async findSaleByUserIdSaleId(@Param('userId') userId: string, @Param('saleId') saleId: string){
        return await this.userSaleService.findSaleByUserIdSaleId(userId, saleId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/sales')
    async findSalesByUserId(@Param('userId') userId: string){
        return await this.userSaleService.findSalesByUserId(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':userId/sales')
    async associateSalesUser(@Body() salesDto: SaleDTO[], @Param('userId') userId: string){
        const sales = plainToInstance(SaleEntity, salesDto)
        return await this.userSaleService.associateSalesUser(userId, sales);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':userId/sales/:saleId')
    @HttpCode(204)
    async deleteSaleUser(@Param('userId') userId: string, @Param('saleId') saleId: string){
        return await this.userSaleService.deleteSaleUser(userId, saleId);
    }
}
