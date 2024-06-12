import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { InstitutionEntity } from '../institution.entity/institution.entity';
import { InstitutionService } from '../institution.service/institution.service';

describe('InstitutionService', () => {
  let service: InstitutionService;
  let repository: Repository<InstitutionEntity>;
  let institutionList: InstitutionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [InstitutionService],
    }).compile();

    service = module.get<InstitutionService>(InstitutionService);
    repository = module.get<Repository<InstitutionEntity>>(
      getRepositoryToken(InstitutionEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    institutionList = [];
    for (let i = 0; i < 5; i++) {
      const institution: InstitutionEntity = await repository.save({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        yearsOfExistence: faker.number.int(),
        schedule: faker.lorem.lines(),
        type: 'Shelter',
      });
      institutionList.push(institution);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all institutions', async () => {
    const institutions: InstitutionEntity[] = await service.findAll();
    expect(institutions).not.toBeNull();
    expect(institutions).toHaveLength(institutionList.length);
  });

  it('findOne should return a institution by id', async () => {
    const storedInstitution: InstitutionEntity = institutionList[0];
    const institution: InstitutionEntity = await service.findById(
      storedInstitution.id,
    );
    expect(institution).not.toBeNull();
    expect(institution.name).toEqual(storedInstitution.name);
    expect(institution.address).toEqual(storedInstitution.address);
    expect(institution.phone).toEqual(storedInstitution.phone);
    expect(institution.email).toEqual(storedInstitution.email);
    expect(institution.yearsOfExistence).toEqual(
      storedInstitution.yearsOfExistence,
    );
    expect(institution.schedule).toEqual(storedInstitution.schedule);
    expect(institution.type).toEqual(storedInstitution.type);
  });

  it('findOne should throw an error if institution does not exist', async () => {
    await expect(() => service.findById('0')).rejects.toHaveProperty(
      'message',
      'The institution with the given id was not found',
    );
  });

  it('create should create a new institution', async () => {
    const institution: InstitutionEntity = {
      id: '',
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: faker.number.int(),
      schedule: faker.lorem.lines(),
      type: 'Shelter',
      user: null,
      pets: [],
      reviews: [],
      donations: [],
    };
    const newInstitution: InstitutionEntity = await service.create(institution);
    expect(newInstitution).not.toBeNull();

    const storedInstitution: InstitutionEntity = await repository.findOne({
      where: { id: newInstitution.id },
    });
    expect(storedInstitution).not.toBeNull();
    expect(storedInstitution.name).toEqual(newInstitution.name);
    expect(storedInstitution.address).toEqual(newInstitution.address);
    expect(storedInstitution.phone).toEqual(newInstitution.phone);
    expect(storedInstitution.email).toEqual(newInstitution.email);
    expect(storedInstitution.yearsOfExistence).toEqual(
      newInstitution.yearsOfExistence,
    );
    expect(storedInstitution.schedule).toEqual(newInstitution.schedule);
    expect(storedInstitution.type).toEqual(newInstitution.type);
  });

  it('update should update an existing institution', async () => {
    const institution: InstitutionEntity = institutionList[0];
    institution.name = 'New Name';
    institution.address = 'New Address';

    const updatedInstitution: InstitutionEntity = await service.update(
      institution.id,
      institution,
    );
    expect(updatedInstitution).not.toBeNull();

    const storedInstitution: InstitutionEntity = await repository.findOne({
      where: { id: updatedInstitution.id },
    });
    expect(storedInstitution).not.toBeNull();
    expect(storedInstitution.name).toEqual(institution.name);
    expect(storedInstitution.address).toEqual(institution.address);
  });

  it('update should throw an error if institution does not exist', async () => {
    let institution: InstitutionEntity = institutionList[0];
    institution = {
      ...institution,
      name: 'New Name',
      address: 'New Address',
    };
    await expect(() => service.update('0', institution)).rejects.toHaveProperty(
      'message',
      'The institution with the given id was not found',
    );
  });

  it('delete should delete an existing institution', async () => {
    const institution: InstitutionEntity = institutionList[0];
    await service.delete(institution.id);
    const deletedInstitution: InstitutionEntity = await repository.findOne({
      where: { id: institution.id },
    });
    expect(deletedInstitution).toBeNull();
  });

  it('delete should throw an error if institution does not exist', async () => {
    const institution: InstitutionEntity = institutionList[0];
    await service.delete(institution.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The institution with the given id was not found',
    );
  });
});
