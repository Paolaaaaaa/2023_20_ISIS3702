import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { classToPlain } from 'class-transformer';

@Injectable()
export class InstitutionDonationService {
  constructor(
    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,

    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
  ) {}

  async addDonationInstitution(
    institutionId: string,
    donation,
  ): Promise<Record<string, any>> {
    const institution: InstitutionEntity =
      await this.institutionRepository.findOne({
        where: { id: institutionId },
        relations: ['donations'],
      });
    if (!institution)
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const inst_copy = institution;

    donation.type = 'Donation';
    donation.institution = institution;
    const sav_donation = await this.saleRepository.save(donation);
    inst_copy.donations = [...institution.donations, sav_donation];

    const up_inst: InstitutionEntity = await this.institutionRepository.save({
      ...institution,
      inst_copy,
    });
    return classToPlain(up_inst, { excludePrefixes: ['institution'] });
  }

  async findDonationByinstitutionIddonationId(
    institutionId: string,
    donationId: string,
  ): Promise<SaleEntity> {
    const institution: InstitutionEntity =
      await this.institutionRepository.findOne({
        where: { id: institutionId },
        relations: ['donations'],
      });
    if (!institution)
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const donation: SaleEntity = await this.saleRepository.findOne({
      where: { id: donationId },
    });
    if (!donation)
      throw new BusinessLogicException(
        'The donation with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const institutionDonation: SaleEntity = institution.donations.find(
      (e) => e.id === donation.id,
    );

    if (!institutionDonation)
      throw new BusinessLogicException(
        'The donation with the given id is not associated to the institution',
        BusinessError.PRECONDITION_FAILED,
      );

    return institutionDonation;
  }

  async findDonationsByinstitutionId(
    institutionId: string,
  ): Promise<SaleEntity[]> {
    const institution: InstitutionEntity =
      await this.institutionRepository.findOne({
        where: { id: institutionId },
        relations: ['donations'],
      });
    if (!institution)
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return institution.donations;
  }

  async associateDonationsinstitution(
    institutionId: string,
    donations: SaleEntity[],
  ): Promise<InstitutionEntity> {
    const institution: InstitutionEntity =
      await this.institutionRepository.findOne({
        where: { id: institutionId },
        relations: ['donations'],
      });

    if (!institution)
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < donations.length; i++) {
      const donation: SaleEntity = await this.saleRepository.findOne({
        where: { id: donations[i].id },
      });
      if (!donation)
        throw new BusinessLogicException(
          'The doantion with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    institution.donations = donations;
    return await this.institutionRepository.save(institution);
  }

  async deleteDonationinstitution(institutionId: string, donationId: string) {
    const donation: SaleEntity = await this.saleRepository.findOne({
      where: { id: donationId },
    });
    if (!donation)
      throw new BusinessLogicException(
        'The donation with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const institution: InstitutionEntity =
      await this.institutionRepository.findOne({
        where: { id: institutionId },
        relations: ['donations'],
      });
    if (!institution)
      throw new BusinessLogicException(
        'The institution with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const institutionDonation: SaleEntity = institution.donations.find(
      (e) => e.id === donation.id,
    );

    if (!institutionDonation)
      throw new BusinessLogicException(
        'The donation with the given id is not associated to the institution',
        BusinessError.PRECONDITION_FAILED,
      );

    institution.donations = institution.donations.filter(
      (e) => e.id !== donationId,
    );
    await this.institutionRepository.save(institution);
  }
}
