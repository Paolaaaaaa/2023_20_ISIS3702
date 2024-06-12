import { Repository } from 'typeorm';
import { InstitutionDonationService } from '../institution-donation.service/institution-donation.service';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { UserEntity } from '../../user/user.entity/user.entity';

describe('InstitutionDonationService', () => {
  let service: InstitutionDonationService;
  let institutionRepository: Repository<InstitutionEntity>;
  let saleRepository: Repository<SaleEntity>;
  let institution: InstitutionEntity;
  let donations: SaleEntity[];
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [InstitutionDonationService],
    }).compile();

    service = module.get<InstitutionDonationService>(
      InstitutionDonationService,
    );
    institutionRepository = module.get<Repository<InstitutionEntity>>(
      getRepositoryToken(InstitutionEntity),
    );
    saleRepository = module.get<Repository<SaleEntity>>(
      getRepositoryToken(SaleEntity),
    );

    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    saleRepository.clear();
    institutionRepository.clear();

    donations = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await userRepository.save({
        username: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.avatar(),
        rol: 'Personal Account',
      });

      const donation: SaleEntity = await saleRepository.save({
        total: faker.number.float(),
        type: 'Donation',
        pets: null,
        institution: null,
        user: user,
      });
      donations.push(donation);
    }

    const user_owner: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    institution = await institutionRepository.save({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: faker.number.int(),
      schedule: faker.lorem.lines(),
      type: 'Shelter',
      user: user_owner,
      donations: donations,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDonationInstitution should add an donation to a institution', async () => {
    const user: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });
    const user_owner: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    const newDonation: SaleEntity = await saleRepository.save({
      total: faker.number.float(),
      type: 'Donation',
      user: user,
      pets: null,
      institution: null,
    });

    const newInstitution: InstitutionEntity = await institutionRepository.save({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: faker.number.int(),
      schedule: faker.lorem.lines(),
      type: 'Shelter',
      user: user_owner,
      donations: [],
    });

    const result = await service.addDonationInstitution(
      newInstitution.id,
      newDonation,
    );

    expect(result.donations.length).toBe(1);
    expect(result.donations[0]).not.toBeNull();
  });

  it('addDonationInstitution should be alwais Donation ', async () => {
    const newInstitution: InstitutionEntity = await institutionRepository.save({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: faker.number.int(),
      schedule: faker.lorem.lines(),
      type: 'Shelter',
    });

    const newDonation: SaleEntity = await saleRepository.save({
      total: 0,
      type: 'Regalo',
    });

    const result = await service.addDonationInstitution(
      newInstitution.id,
      newDonation,
    );
    expect(result.donations.length).toBe(1);
    expect(result.donations[0]).not.toBeNull();
    expect(result.donations[0].type).toBe('Donation');
  });

  it('addDonationMuseum should throw an exception for an invalid institution', async () => {
    const newDonation: SaleEntity = await saleRepository.save({
      total: faker.number.float(),
      type: 'Donation',
    });

    await expect(() =>
      service.addDonationInstitution('0', newDonation.id),
    ).rejects.toHaveProperty(
      'message',
      'The institution with the given id was not found',
    );
  });

  it('findDonationByInstitutionIdDonationId should return donation by institution', async () => {
    const donation: SaleEntity = donations[0];
    const strDonations: SaleEntity =
      await service.findDonationByinstitutionIddonationId(
        institution.id,
        donation.id,
      );
    expect(strDonations).not.toBeNull();
  });

  it('findDonationByInstitutionIdDonationId should throw an exception for an invalid donation', async () => {
    await expect(() =>
      service.findDonationByinstitutionIddonationId(
        institution.id,
        '4c3c33ff-0571-4952-87fc-ea0aa754030d',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The donation with the given id was not found',
    );
  });

  it('findDonationByInstitutionIdDonationId should throw an exception for an invalid institution', async () => {
    const donation: SaleEntity = donations[0];
    await expect(() =>
      service.findDonationByinstitutionIddonationId(
        '4c3c33ff-0571-4952-87fc-ea0aa754030d',
        donation.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The institution with the given id was not found',
    );
  });

  it('findDonationByInstitutionIdDonationId should throw an exception for an donation not associated to the Institution', async () => {
    const user: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    const newDonation: SaleEntity = await saleRepository.save({
      total: faker.number.float(),
      type: 'Donation',
      user: user,
      pets: null,
      institution: null,
    });

    await expect(() =>
      service.findDonationByinstitutionIddonationId(
        institution.id,
        newDonation.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The donation with the given id is not associated to the institution',
    );
  });

  it('findDonationsByinstitutionId should return donations by institution', async () => {
    const donations: SaleEntity[] = await service.findDonationsByinstitutionId(
      institution.id,
    );
    expect(donations.length).toBe(5);
  });

  it('findDonationsByinstitutionId should throw an exception for an invalid institution', async () => {
    await expect(() =>
      service.findDonationsByinstitutionId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The institution with the given id was not found',
    );
  });
});
