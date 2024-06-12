import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../../shared/errors/business-errors';
import { InstitutionEntity } from '../institution.entity/institution.entity';


@Injectable()
export class InstitutionService {
    constructor(
        @InjectRepository(InstitutionEntity)
        private readonly institutionRepository: Repository<InstitutionEntity>,
    ) {}

    
    async findAll(): Promise<InstitutionEntity[]> {
        return await this.institutionRepository.find({ relations: ['user', 'pets', 'reviews', 'donations'] });
    }
    async findById(id: string): Promise<InstitutionEntity> {
        const institution: InstitutionEntity = await this.institutionRepository.findOne({where: {id}, relations: ['user', 'pets', 'reviews', 'donations']});
        if (!institution) 
        throw new BusinessLogicException('The institution with the given id was not found', BusinessError.NOT_FOUND); 
        return institution;
    }

    async create(institution: InstitutionEntity): Promise<InstitutionEntity> {
        institution.donations=[];
        return await this.institutionRepository.save(institution);
    }

    async update(id: string, institution: InstitutionEntity): Promise<InstitutionEntity> {
        const pesistedInstitution: InstitutionEntity = await this.institutionRepository.findOne({where: {id}});
        if (!pesistedInstitution) 
        throw new BusinessLogicException('The institution with the given id was not found', BusinessError.NOT_FOUND); 
        institution.id = id;
        return await this.institutionRepository.save(institution);
    }


    async delete(id: string){
        const institution: InstitutionEntity = await this.institutionRepository.findOne({where: {id}});
        if (!institution) 
        throw new BusinessLogicException('The institution with the given id was not found', BusinessError.NOT_FOUND); 
        await this.institutionRepository.remove(institution);
    }
}

    