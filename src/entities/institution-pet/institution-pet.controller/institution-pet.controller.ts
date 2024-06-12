import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { InstitutionPetService } from '../institution-pet.service/institution-pet.service';
import { PetDto } from 'src/entities/pet/pet.dto/pet.dto';
import { plainToInstance } from 'class-transformer';
import { PetEntity } from 'src/entities/pet/pet.entity/pet.entity';
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller('institutions')
@UseInterceptors(BusinessErrorsInterceptor)
export class InstitutionPetController {
    constructor( private readonly institutionPetService: InstitutionPetService ) {}

    @UseGuards(JwtAuthGuard)
    @Post(':institutionId/pets/:petId')
    async addPetInstitution(@Param('institutionId') institutionId: string, @Param('petId') petId: string) {
        return await this.institutionPetService.addPetInstitution(institutionId, petId);
    }

    @Get(':institutionId/pets/:petId')
    async findPetByInstitutionIdPetId(@Param('institutionId') institutionId: string, @Param('petId') petId: string) {
        return await this.institutionPetService.findPetByInstitutionIdPetId(institutionId, petId);
    }

    @Get(':institutionId/pets')
    async findPetsByInstitutionId(@Param('institutionId') institutionId: string) {
        return await this.institutionPetService.findPetsByInstitutionId(institutionId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':institutionId/pets')
    async associatePetsInstitution(@Body() petsDto: PetDto[], @Param('institutionId') institutionId: string) {
        const pets = plainToInstance(PetEntity, petsDto)
        return await this.institutionPetService.associatePetsInstitution(institutionId, pets);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':institutionId/pets/:petId')
    @HttpCode(204)
    async deletePetInstitution(@Param('institutionId') institutionId: string, @Param('petId') petId: string) {
        return await this.institutionPetService.deletePetInstitution(institutionId, petId);
    }
}
