import { Test, TestingModule } from '@nestjs/testing';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity/user.entity';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { UserSaleService } from './user_sale.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UserSaleService', () => {
  let service: UserSaleService;
  let userRepository: Repository<UserEntity>;
  let saleRepository: Repository<SaleEntity>;
  let user: UserEntity;
  let salesList: SaleEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserSaleService],
    }).compile();

    service = module.get<UserSaleService>(UserSaleService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    saleRepository = module.get<Repository<SaleEntity>>(getRepositoryToken(SaleEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    saleRepository.clear();
    userRepository.clear();

    salesList = [];
    for(let i = 0; i < 5; i++){
        const sale: SaleEntity = await saleRepository.save({
          total: faker.datatype.number(),
          type: faker.helpers.arrayElement(['Cart', 'Donation'])
        })
        salesList.push(sale);
    }

    user = await userRepository.save({
      username: faker.person.fullName(),
      password: faker.internet.password(),
      email : faker.internet.email(),
      image: faker.image.url(),
      rol: faker.helpers.arrayElement(['Admin', 'Personal Account', 'Business Account']),
      sales : salesList
    })
  }

  // Pruebas de que el servicio esta disponible y definido
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Prubeas del post de asociacion Sale con User
  it('addSaleUser should add an sale to a user', async () => {
    const newSale: SaleEntity = await saleRepository.save({
      total: faker.datatype.number(),
      type: faker.helpers.arrayElement(['Cart', 'Donation'])
    });

    const newUser: UserEntity = await userRepository.save({
      username: faker.person.fullName(),
      password: faker.internet.password(),
      email : faker.internet.email(),
      image: faker.image.url(),
      rol: faker.helpers.arrayElement(['Admin', 'Personal Account', 'Business Account'])
    })

    const result: UserEntity = await service.addSaleUser(newUser.id, newSale.id);
    
    expect(result.sales.length).toBe(1);
    expect(result.sales[0]).not.toBeNull();
    expect(result.sales[0].total).toBe(newSale.total)
    expect(result.sales[0].type).toBe(newSale.type)
  });

  it('addSaleUser should thrown exception for an invalid sale', async () => {
    const newUser: UserEntity = await userRepository.save({
      username: faker.person.fullName(),
      password: faker.internet.password(),
      email : faker.internet.email(),
      image: faker.image.url(),
      rol: faker.helpers.arrayElement(['Admin', 'Personal Account', 'Business Account'])
    })

    await expect(() => service.addSaleUser(newUser.id, "0")).rejects.toHaveProperty("message", "The sale with the given id was not found");
  });

  it('addSaleUser should throw an exception for an invalid user', async () => {
    const newSale: SaleEntity = await saleRepository.save({
      total: faker.datatype.number(),
      type: faker.helpers.arrayElement(['Cart', 'Donation'])
    });

    await expect(() => service.addSaleUser("0", newSale.id)).rejects.toHaveProperty("message", "The user with the given id was not found");
  });


  // Pruebas del Get de sale en user
  it('findSaleByUserIdSaleId should return sale by user', async () => {
    const sale: SaleEntity = salesList[0];
    const storedSale: SaleEntity = await service.findSaleByUserIdSaleId(user.id, sale.id)
    expect(storedSale).not.toBeNull();
    expect(storedSale.total).toBe(sale.total)
    expect(storedSale.type).toBe(sale.type)
  });

  it('findSaleByUserIdSaleId should throw an exception for an invalid sale', async () => {
    await expect(()=> service.findSaleByUserIdSaleId(user.id, "0")).rejects.toHaveProperty("message", "The sale with the given id was not found"); 
  });

  it('findSaleByUserIdSaleId should throw an exception for an invalid user', async () => {
    const sale: SaleEntity = salesList[0]; 
    await expect(()=> service.findSaleByUserIdSaleId("0", sale.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('findSaleByUserIdSaleId should throw an exception for an sale not associated to the user', async () => {
    const newSale: SaleEntity = await saleRepository.save({
      total: faker.datatype.number(),
      type: faker.helpers.arrayElement(['Cart', 'Donation'])
    });

    await expect(()=> service.findSaleByUserIdSaleId(user.id, newSale.id)).rejects.toHaveProperty("message", "The sale with the given id is not associated to the user"); 
  });

  //Pruebas de la Get de Sales de una User
  it('findSalesByUserId should return sales by user', async ()=>{
    const sales: SaleEntity[] = await service.findSalesByUserId(user.id);
    expect(sales.length).toBe(5)
  });

  it('findSalesByUserId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findSalesByUserId("0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  // Pruebas de los Updates
  it('associateSalesUser should update sales list for a user', async () => {
    const newSale: SaleEntity = await saleRepository.save({
      total: faker.datatype.number(),
      type: faker.helpers.arrayElement(['Cart', 'Donation'])
    });

    const updatedUser: UserEntity = await service.associateSalesUser(user.id, [newSale]);
    expect(updatedUser.sales.length).toBe(1);

    expect(updatedUser.sales[0].total).toBe(newSale.total);
    expect(updatedUser.sales[0].type).toBe(newSale.type);
  });

  it('associateSalesUser should throw an exception for an invalid user', async () => {
    const newSale: SaleEntity = await saleRepository.save({
      total: faker.datatype.number(),
      type: faker.helpers.arrayElement(['Cart', 'Donation'])
    });

    await expect(()=> service.associateSalesUser("0", [newSale])).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateSalesUser should throw an exception for an invalid sale', async () => {
    const newSale: SaleEntity = salesList[0];
    newSale.id = "0";

    await expect(()=> service.associateSalesUser(user.id, [newSale])).rejects.toHaveProperty("message", "The sale with the given id was not found"); 
  });

  // Pruebas de los Deletes
  it('deleteSaleToUser should remove an sale from a user', async () => {
    const sale: SaleEntity = salesList[0];
    
    await service.deleteSaleUser(user.id, sale.id);

    const storedUser: UserEntity = await userRepository.findOne({where: {id: user.id}, relations: ["sales"]});
    const deletedSale: SaleEntity = storedUser.sales.find(a => a.id === sale.id);

    expect(deletedSale).toBeUndefined();

  });

  it('deleteSaleToUser should thrown an exception for an invalid sale', async () => {
    await expect(()=> service.deleteSaleUser(user.id, "0")).rejects.toHaveProperty("message", "The sale with the given id was not found"); 
  });

  it('deleteSaleToUser should thrown an exception for an invalid user', async () => {
    const sale: SaleEntity = salesList[0];
    await expect(()=> service.deleteSaleUser("0", sale.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('deleteSaleToUser should thrown an exception for an non asocciated sale', async () => {
    const newSale: SaleEntity = await saleRepository.save({
      total: faker.datatype.number(),
      type: faker.helpers.arrayElement(['Cart', 'Donation'])
    });

    await expect(()=> service.deleteSaleUser(user.id, newSale.id)).rejects.toHaveProperty("message", "The sale with the given id is not associated to the user"); 
  });

});
