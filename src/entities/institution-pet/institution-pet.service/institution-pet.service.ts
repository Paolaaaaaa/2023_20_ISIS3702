/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetEntity } from '../../pet/pet.entity/pet.entity';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../../shared/errors/business-errors';

@Injectable()
export class InstitutionPetService {
    constructor(
        @InjectRepository(InstitutionEntity)
        private readonly institutionRepository: Repository<InstitutionEntity>,
     
        @InjectRepository(PetEntity)
        private readonly petRepository: Repository<PetEntity>
    ) {}

    async addPetInstitution(institutionId: string, petId: string): Promise<InstitutionEntity> {
        const pet: PetEntity = await this.petRepository.findOne({where: {id: petId}});
        if (!pet)
          throw new BusinessLogicException("The pet with the given id was not found", BusinessError.NOT_FOUND);
       
        const institution: InstitutionEntity = await this.institutionRepository.findOne({where: {id: institutionId}, relations: ["pets"]}) 
        if (!institution)
          throw new BusinessLogicException("The institution with the given id was not found", BusinessError.NOT_FOUND);
     
          institution.pets.push(pet);
          const updatedInstitution = await this.institutionRepository.save(institution);
      
          return updatedInstitution;
      }
     
    async findPetByInstitutionIdPetId(institutionId: string, petId: string): Promise<PetEntity> {
        const pet: PetEntity = await this.petRepository.findOne({where: {id: petId}});
        if (!pet)
          throw new BusinessLogicException("The pet with the given id was not found", BusinessError.NOT_FOUND)
        
        const institution: InstitutionEntity = await this.institutionRepository.findOne({where: {id: institutionId}, relations: ["pets"]}); 
        if (!institution)
          throw new BusinessLogicException("The institution with the given id was not found", BusinessError.NOT_FOUND)
    
        const institutionPet: PetEntity = institution.pets.find(e => e.id === pet.id);
    
        if (!institutionPet)
          throw new BusinessLogicException("The pet with the given id is not associated to the institution", BusinessError.PRECONDITION_FAILED)
    
        return institutionPet;
    }
     
    async findPetsByInstitutionId(institutionId: string): Promise<PetEntity[]> {
        const institution: InstitutionEntity = await this.institutionRepository.findOne({where: {id: institutionId}, relations: ["pets"]});
        if (!institution)
          throw new BusinessLogicException("The institution with the given id was not found", BusinessError.NOT_FOUND)
        
        return institution.pets;
    }
     
    async associatePetsInstitution(institutionId: string, pets: PetEntity[]): Promise<InstitutionEntity> {
        const institution: InstitutionEntity = await this.institutionRepository.findOne({where: {id: institutionId}, relations: ["pets"]});
     
        if (!institution)
          throw new BusinessLogicException("The institution with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < pets.length; i++) {
          const pet: PetEntity = await this.petRepository.findOne({where: {id: pets[i].id}});
          if (!pet)
            throw new BusinessLogicException("The pet with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        institution.pets = pets;
        return await this.institutionRepository.save(institution);
      }
     
    async deletePetInstitution(institutionId: string, petId: string){
        const pet: PetEntity = await this.petRepository.findOne({where: {id: petId}});
        if (!pet)
          throw new BusinessLogicException("The pet with the given id was not found", BusinessError.NOT_FOUND)
     
        const institution: InstitutionEntity = await this.institutionRepository.findOne({where: {id: institutionId}, relations: ["pets"]});
        if (!institution)
          throw new BusinessLogicException("The institution with the given id was not found", BusinessError.NOT_FOUND)
     
        const institutionPet: PetEntity = institution.pets.find(e => e.id === pet.id);
     
        if (!institutionPet)
            throw new BusinessLogicException("The pet with the given id is not associated to the institution", BusinessError.PRECONDITION_FAILED)

        institution.pets = institution.pets.filter(e => e.id !== petId);
        await this.institutionRepository.save(institution);
    }   
}