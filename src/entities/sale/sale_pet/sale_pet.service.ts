/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleEntity } from '../sale.entity/sale.entity';
import { PetEntity } from '../../pet/pet.entity/pet.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../../shared/errors/business-errors';
import { isUUID } from 'class-validator';

// ------------------------------------------------------------

@Injectable()
export class SalePetService {
    constructor(
        @InjectRepository(SaleEntity)
        private readonly saleRepository: Repository<SaleEntity>,
     
        @InjectRepository(PetEntity)
        private readonly petRepository: Repository<PetEntity>
    ) {}

    async addPetSale(saleId: string, petId: string): Promise<SaleEntity> {
        const pet: PetEntity = await this.petRepository.findOne({where: {id: petId}});
        if (!pet)
          throw new BusinessLogicException("The pet with the given id was not found", BusinessError.NOT_FOUND);
       
        const sale: SaleEntity = await this.saleRepository.findOne({where: {id: saleId}, relations: ["pets"]}) 
        if (!sale)
          throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND);
     
        sale.pets = [...sale.pets, pet];
        return await this.saleRepository.save(sale);
      }
     
    async findPetBySaleIdPetId(saleId: string, petId: string): Promise<PetEntity> {

        const pet: PetEntity = await this.petRepository.findOne({where: {id: petId}});
        if (!pet)
          throw new BusinessLogicException("The pet with the given id was not found", BusinessError.NOT_FOUND)
        
        const sale: SaleEntity = await this.saleRepository.findOne({where: {id: saleId}, relations: ["pets"]}); 
        if (!sale)
          throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND)
    
        const salePet: PetEntity = sale.pets.find(e => e.id === pet.id);
    
        if (!salePet)
          throw new BusinessLogicException("The pet with the given id is not associated to the sale", BusinessError.PRECONDITION_FAILED)
    
        return salePet;
    }
     
    async findPetsBySaleId(saleId: string): Promise<PetEntity[]> {
        const sale: SaleEntity = await this.saleRepository.findOne({where: {id: saleId}, relations: ["pets"]});
        if (!sale)
          throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND)
        
        return sale.pets;
    }
     
    async associatePetsSale(saleId: string, pets: PetEntity[]): Promise<SaleEntity> {
        const sale: SaleEntity = await this.saleRepository.findOne({where: {id: saleId}, relations: ["pets"]});
     
        if (!sale)
          throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < pets.length; i++) {
          const pet: PetEntity = await this.petRepository.findOne({where: {id: pets[i].id}});
          if (!pet)
            throw new BusinessLogicException("The pet with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        sale.pets = pets;
        return await this.saleRepository.save(sale);
      }
     
    async deletePetSale(saleId: string, petId: string){
        const pet: PetEntity = await this.petRepository.findOne({where: {id: petId}});
        if (!pet)
          throw new BusinessLogicException("The pet with the given id was not found", BusinessError.NOT_FOUND)
     
        const sale: SaleEntity = await this.saleRepository.findOne({where: {id: saleId}, relations: ["pets"]});
        if (!sale)
          throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND)
     
        const salePet: PetEntity = sale.pets.find(e => e.id === pet.id);
     
        if (!salePet)
            throw new BusinessLogicException("The pet with the given id is not associated to the sale", BusinessError.PRECONDITION_FAILED)

        sale.pets = sale.pets.filter(e => e.id !== petId);
        await this.saleRepository.save(sale);
    }   
}