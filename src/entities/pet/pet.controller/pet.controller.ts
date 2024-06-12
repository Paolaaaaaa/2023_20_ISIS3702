import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors/business-errors.interceptor';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PetEntity } from '../pet.entity/pet.entity';
import { PetService } from '../pet.service/pet.service';
import { PetDto } from '../pet.dto/pet.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('pets')
@UseInterceptors(BusinessErrorsInterceptor)
export class PetController {
    constructor( private readonly petService: PetService ) {}

    @Get()
    async findAll() {
        return await this.petService.findAll();
    }

    @Get(':petId')
    async findById(@Param('petId') petId: string) {
        return await this.petService.findById(petId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() petDto: PetDto) {
        const pet: PetEntity = plainToInstance(PetEntity, petDto);
        return await this.petService.create(pet);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':petId')
    async update(@Param('petId') petId: string, @Body() petDto: PetDto) {
        const pet: PetEntity = plainToInstance(PetEntity, petDto);
        return await this.petService.update(petId, pet);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':petId')
    @HttpCode(204)
    async delete(@Param('petId') petId: string) {
        return await this.petService.delete(petId);
    }
}

