/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity/user.entity';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../../shared/errors/business-errors';

// ------------------------------------------------------------

@Injectable()
export class UserSaleService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
     
        @InjectRepository(SaleEntity)
        private readonly saleRepository: Repository<SaleEntity>
    ) {}

    async addSaleUser(userId: string, saleId: string): Promise<UserEntity> {
        const sale: SaleEntity = await this.saleRepository.findOne({where: {id: saleId}});
        if (!sale)
          throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND);
       
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["sales"]}) 
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
     
        user.sales = [...user.sales, sale];
        return await this.userRepository.save(user);
      }
     
    async findSaleByUserIdSaleId(userId: string, saleId: string): Promise<SaleEntity> {
        const sale: SaleEntity = await this.saleRepository.findOne({where: {id: saleId}});
        if (!sale)
          throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND)
        
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["sales"]}); 
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
    
        const userSale: SaleEntity = user.sales.find(e => e.id === sale.id);
    
        if (!userSale)
          throw new BusinessLogicException("The sale with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)
    
        return userSale;
    }
     
    async findSalesByUserId(userId: string): Promise<SaleEntity[]> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["sales"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
        
        return user.sales;
    }
     
    async associateSalesUser(userId: string, sales: SaleEntity[]): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["sales"]});
     
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < sales.length; i++) {
          const sale: SaleEntity = await this.saleRepository.findOne({where: {id: sales[i].id}});
          if (!sale)
            throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        user.sales = sales;
        return await this.userRepository.save(user);
      }
     
    async deleteSaleUser(userId: string, saleId: string){
        const sale: SaleEntity = await this.saleRepository.findOne({where: {id: saleId}});
        if (!sale)
          throw new BusinessLogicException("The sale with the given id was not found", BusinessError.NOT_FOUND)
     
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["sales"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
     
        const userSale: SaleEntity = user.sales.find(e => e.id === sale.id);
     
        if (!userSale)
            throw new BusinessLogicException("The sale with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)

        user.sales = user.sales.filter(e => e.id !== saleId);
        await this.userRepository.save(user);
    }   
}