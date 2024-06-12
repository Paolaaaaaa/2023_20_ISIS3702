import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetEntity } from '../pet.entity/pet.entity';
import { BusinessError, BusinessLogicException } from '../../../shared/errors/business-errors';

@Injectable()
export class PetService {
    constructor(
        @InjectRepository(PetEntity)
        private readonly petRepository: Repository<PetEntity>,
    ) {}

    async findAll(): Promise<PetEntity[]> {
        return await this.petRepository.find({ relations: ['institution'] });
    }
    async findById(id: string): Promise<PetEntity> {
        const pet: PetEntity = await this.petRepository.findOne({where: {id}, relations: ['institution']});
        if (!pet) 
        throw new BusinessLogicException('The pet with the given id was not found', BusinessError.NOT_FOUND); 
        return pet;
    }

    async create(pet: PetEntity): Promise<PetEntity> {
        return await this.petRepository.save(pet);
    }

    async update(id: string, pet: PetEntity): Promise<PetEntity> {
        const pesistedPet: PetEntity = await this.petRepository.findOne({where: {id}});
        if (!pesistedPet) 
        throw new BusinessLogicException('The pet with the given id was not found', BusinessError.NOT_FOUND); 
        pet.id = id;
        return await this.petRepository.save(pet);
    }


    async delete(id: string){
        const pet: PetEntity = await this.petRepository.findOne({where: {id}});
        if (!pet) 
        throw new BusinessLogicException('The pet with the given id was not found', BusinessError.NOT_FOUND); 
        await this.petRepository.remove(pet);
    }
}
