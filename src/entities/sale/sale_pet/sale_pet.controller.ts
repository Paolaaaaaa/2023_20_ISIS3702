/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors , UseGuards} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PetEntity } from '../../pet/pet.entity/pet.entity';
import { PetDto } from '../../pet/pet.dto/pet.dto';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors.interceptors';
import { SalePetService } from './sale_pet.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseInterceptors(BusinessErrorsInterceptor)
export class SalePetController {
    constructor(private readonly salePetService: SalePetService){}

    @UseGuards(JwtAuthGuard)
    @Post(':saleId/pets/:petId')
    async addPetSale(@Param('saleId') saleId: string, @Param('petId') petId: string){
        return await this.salePetService.addPetSale(saleId, petId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':saleId/pets/:petId')
    async findPetBySaleIdPetId(@Param('saleId') saleId: string, @Param('petId') petId: string){
        return await this.salePetService.findPetBySaleIdPetId(saleId, petId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':saleId/pets')
    async findPetsBySaleId(@Param('saleId') saleId: string){
        return await this.salePetService.findPetsBySaleId(saleId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':saleId/pets')
    async associatePetsSale(@Body() petsDto: PetDto[], @Param('saleId') saleId: string){
        const pets = plainToInstance(PetEntity, petsDto)
        return await this.salePetService.associatePetsSale(saleId, pets);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':saleId/pets/:petId')
    @HttpCode(204)
    async deletePetSale(@Param('saleId') saleId: string, @Param('petId') petId: string){
        return await this.salePetService.deletePetSale(saleId, petId);
    }
}
