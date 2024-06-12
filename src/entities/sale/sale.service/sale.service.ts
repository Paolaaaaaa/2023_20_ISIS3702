import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleEntity } from '../sale.entity/sale.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
  ) {}

  async create(sale: SaleEntity): Promise<SaleEntity> {


    if (sale.type !== 'Donation' && sale.type != 'Sale') {
      throw new BusinessLogicException(
        'The sale type is not valid',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.saleRepository.save(sale);
  }

  async findAll(): Promise<SaleEntity[]> {
    return await this.saleRepository.find();
  }

  async findOne(id: string): Promise<SaleEntity> {
    const sale: SaleEntity = await this.saleRepository.findOne({
      where: { id },
    });
    if (!sale)
      throw new BusinessLogicException(
        'The sale with given id was not found',
        BusinessError.NOT_FOUND,
      );
    return sale;
  }

  async update(id: string, sale: SaleEntity): Promise<SaleEntity> {
    const persistedSale: SaleEntity = await this.saleRepository.findOne({where: {id}});
    if (!persistedSale)
      throw new BusinessLogicException('The sale with the given id was not found', BusinessError.NOT_FOUND);

    if (sale.type !== 'Donation' && sale.type != 'Sale') {
      throw new BusinessLogicException('The sale type is not valid', BusinessError.PRECONDITION_FAILED);
    }

    sale.id = id;
    return await this.saleRepository.save(sale);
  }

  async delete(id: string): Promise<void> {
    const sale: SaleEntity = await this.saleRepository.findOne({where: {id}});
    if (!sale)
      throw new BusinessLogicException('The sale with the given id was not found', BusinessError.NOT_FOUND);

    await this.saleRepository.remove(sale);
  }


}
