import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { SaleEntity } from '../sale.entity/sale.entity';
import { SaleService } from '../sale.service/sale.service';
import { UserEntity } from '../../user/user.entity/user.entity';

describe('SaleService', () => {
  let service: SaleService;
  let repository: Repository<SaleEntity>;
  let user_rep: Repository<UserEntity>;
  let saleList: SaleEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SaleService],
    }).compile();

    user_rep = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    service = module.get<SaleService>(SaleService);
    repository = module.get<Repository<SaleEntity>>(
      getRepositoryToken(SaleEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    saleList = [];
    const user: UserEntity = await user_rep.save({
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });
    for (let i = 0; i < 5; i++) {
      const sale: SaleEntity = await repository.save({
        total: faker.number.int(),
        user: user,
        pets: null,
        institution: null,
        type: 'Donation',
      });
      saleList.push(sale);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all institutions', async () => {
    const saleList: SaleEntity[] = await service.findAll();
    expect(saleList).not.toBeNull();
    expect(saleList).toHaveLength(saleList.length);
  });

  it('findOne should return a sale by id', async () => {
    const strSale: SaleEntity = saleList[0];
    const sale: SaleEntity = await service.findOne(strSale.id);
    expect(sale).not.toBeNull();
    expect(sale.total).toEqual(strSale.total);
    expect(sale.type).toEqual(strSale.type);
  });

  it('findOne should throw an error if sale does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The sale with given id was not found',
    );
  });

  it('create should create a new sale', async () => {
    const user: UserEntity = await user_rep.save({
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    const sale: SaleEntity = {
      total: faker.number.int(),
      user: user,
      pets: null,
      institution: null,
      type: 'Donation',
      id: '',
    };
    const newSale: SaleEntity = await service.create(sale);
    expect(newSale).not.toBeNull();

    const strSale: SaleEntity = await repository.findOne({
      where: { id: newSale.id },
    });
    expect(strSale).not.toBeNull();
    expect(strSale.total).toEqual(newSale.total);
    expect(strSale.type).toEqual(newSale.type);
  });
});
