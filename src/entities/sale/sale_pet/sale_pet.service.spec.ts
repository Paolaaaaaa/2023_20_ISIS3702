import { Test, TestingModule } from '@nestjs/testing';
import { PetEntity } from '../../pet/pet.entity/pet.entity';
import { Repository } from 'typeorm';
import { SaleEntity } from '../sale.entity/sale.entity';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { SalePetService } from './sale_pet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SalePetService', () => {
  let service: SalePetService;
  let saleRepository: Repository<SaleEntity>;
  let petRepository: Repository<PetEntity>;
  let sale: SaleEntity;
  let petsList: PetEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SalePetService],
    }).compile();

    service = module.get<SalePetService>(SalePetService);
    saleRepository = module.get<Repository<SaleEntity>>(getRepositoryToken(SaleEntity));
    petRepository = module.get<Repository<PetEntity>>(getRepositoryToken(PetEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    petRepository.clear();
    saleRepository.clear();

    petsList = [];
    for(let i = 0; i < 5; i++){
        const pet: PetEntity = await petRepository.save({
          name: faker.name.firstName(), 
          price: faker.datatype.number(),
          age: faker.datatype.number({ min: 1, max: 10 }),
          race: faker.animal.dog(),
          specie: faker.helpers.arrayElement(['Gato', 'Perro']),
          color: faker.color.human(),
          description: faker.lorem.sentence()
        })
        petsList.push(pet);
    }

    sale = await saleRepository.save({
      total: faker.datatype.number(),
      type: "Cart",
      pets: petsList
    })
  }

  // Pruebas de que el servicio esta disponible y definido
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Prubeas del post de asociacion Pet con Sale
  it('addPetSale should add an pet to a sale', async () => {
    const newPet: PetEntity = await petRepository.save({
      name: faker.name.firstName(), 
      price: faker.datatype.number(),
      age: faker.datatype.number({ min: 1, max: 10 }),
      race: faker.animal.dog(),
      specie: faker.helpers.arrayElement(['Gato', 'Perro']),
      color: faker.color.human(),
      description: faker.lorem.sentence()
    });

    const newSale: SaleEntity = await saleRepository.save({
      total: faker.datatype.number(),
      type: "Cart"
    })

    const result: SaleEntity = await service.addPetSale(newSale.id, newPet.id);
    
    expect(result.pets.length).toBe(1);
    expect(result.pets[0]).not.toBeNull();
    expect(result.pets[0].name).toBe(newPet.name)
    expect(result.pets[0].price).toBe(newPet.price)
    expect(result.pets[0].age).toBe(newPet.age)
    expect(result.pets[0].race).toBe(newPet.race)
    expect(result.pets[0].specie).toBe(newPet.specie)
    expect(result.pets[0].color).toBe(newPet.color)
    expect(result.pets[0].description).toBe(newPet.description)
  });

  it('addPetSale should thrown exception for an invalid pet', async () => {
    const newSale: SaleEntity = await saleRepository.save({
      total: faker.datatype.number(),
      type: "Cart"
    })

    await expect(() => service.addPetSale(newSale.id, "0")).rejects.toHaveProperty("message", "The pet with the given id was not found");
  });

  it('addPetSale should throw an exception for an invalid sale', async () => {
    const newPet: PetEntity = await petRepository.save({
      name: faker.name.firstName(), 
      price: faker.datatype.number(),
      age: faker.datatype.number({ min: 1, max: 10 }),
      race: faker.animal.dog(),
      specie: faker.helpers.arrayElement(['Gato', 'Perro']),
      color: faker.color.human(),
      description: faker.lorem.sentence()
    });

    await expect(() => service.addPetSale("0", newPet.id)).rejects.toHaveProperty("message", "The sale with the given id was not found");
  });


  // Pruebas del Get de pet en una sale
  it('findPetBySaleIdPetId should return pet by sale', async () => {
    const pet: PetEntity = petsList[0];
    const storedPet: PetEntity = await service.findPetBySaleIdPetId(sale.id, pet.id, )
    expect(storedPet).not.toBeNull();
    expect(storedPet.name).toBe(pet.name)
    expect(storedPet.price).toBe(pet.price)
    expect(storedPet.age).toBe(pet.age)
    expect(storedPet.race).toBe(pet.race)
    expect(storedPet.specie).toBe(pet.specie)
    expect(storedPet.color).toBe(pet.color)
    expect(storedPet.description).toBe(pet.description)
  });

  it('findPetBySaleIdPetId should throw an exception for an invalid pet', async () => {
    await expect(()=> service.findPetBySaleIdPetId(sale.id, "0")).rejects.toHaveProperty("message", "The pet with the given id was not found"); 
  });

  it('findPetBySaleIdPetId should throw an exception for an invalid sale', async () => {
    const pet: PetEntity = petsList[0]; 
    await expect(()=> service.findPetBySaleIdPetId("0", pet.id)).rejects.toHaveProperty("message", "The sale with the given id was not found"); 
  });

  it('findPetBySaleIdPetId should throw an exception for an pet not associated to the sale', async () => {
    const newPet: PetEntity = await petRepository.save({
      name: faker.name.firstName(), 
      price: faker.datatype.number(),
      age: faker.datatype.number({ min: 1, max: 10 }),
      race: faker.animal.dog(),
      specie: faker.helpers.arrayElement(['Gato', 'Perro']),
      color: faker.color.human(),
      description: faker.lorem.sentence()
    });

    await expect(()=> service.findPetBySaleIdPetId(sale.id, newPet.id)).rejects.toHaveProperty("message", "The pet with the given id is not associated to the sale"); 
  });

  //Pruebas de la Get de Pets de Sale
  it('findPetsBySaleId should return pets by sale', async ()=>{
    const pets: PetEntity[] = await service.findPetsBySaleId(sale.id);
    expect(pets.length).toBe(5)
  });

  it('findPetsBySaleId should throw an exception for an invalid sale', async () => {
    await expect(()=> service.findPetsBySaleId("0")).rejects.toHaveProperty("message", "The sale with the given id was not found"); 
  });

  // Pruebas de los Updates
  it('associatePetsSale should update pets list for a sale', async () => {
    const newPet: PetEntity = await petRepository.save({
      name: faker.name.firstName(), 
      price: faker.datatype.number(),
      age: faker.datatype.number({ min: 1, max: 10 }),
      race: faker.animal.dog(),
      specie: faker.helpers.arrayElement(['Gato', 'Perro']),
      color: faker.color.human(),
      description: faker.lorem.sentence()
    });

    const updatedSale: SaleEntity = await service.associatePetsSale(sale.id, [newPet]);
    expect(updatedSale.pets.length).toBe(1);

    expect(updatedSale.pets[0].name).toBe(newPet.name);
    expect(updatedSale.pets[0].price).toBe(newPet.price);
    expect(updatedSale.pets[0].age).toBe(newPet.age);
    expect(updatedSale.pets[0].race).toBe(newPet.race);
    expect(updatedSale.pets[0].color).toBe(newPet.color);
    expect(updatedSale.pets[0].description).toBe(newPet.description);
  });

  it('associatePetsSale should throw an exception for an invalid sale', async () => {
    const newPet: PetEntity = await petRepository.save({
      name: faker.name.firstName(), 
      price: faker.datatype.number(),
      age: faker.datatype.number({ min: 1, max: 10 }),
      race: faker.animal.dog(),
      specie: faker.helpers.arrayElement(['Gato', 'Perro']),
      color: faker.color.human(),
      description: faker.lorem.sentence()
    });

    await expect(()=> service.associatePetsSale("0", [newPet])).rejects.toHaveProperty("message", "The sale with the given id was not found"); 
  });

  it('associatePetsSale should throw an exception for an invalid pet', async () => {
    const newPet: PetEntity = petsList[0];
    newPet.id = "0";

    await expect(()=> service.associatePetsSale(sale.id, [newPet])).rejects.toHaveProperty("message", "The pet with the given id was not found"); 
  });

  // Pruebas de los Deletes
  it('deletePetToSale should remove an pet from a sale', async () => {
    const pet: PetEntity = petsList[0];
    
    await service.deletePetSale(sale.id, pet.id);

    const storedSale: SaleEntity = await saleRepository.findOne({where: {id: sale.id}, relations: ["pets"]});
    const deletedPet: PetEntity = storedSale.pets.find(a => a.id === pet.id);

    expect(deletedPet).toBeUndefined();

  });

  it('deletePetToSale should thrown an exception for an invalid pet', async () => {
    await expect(()=> service.deletePetSale(sale.id, "0")).rejects.toHaveProperty("message", "The pet with the given id was not found"); 
  });

  it('deletePetToSale should thrown an exception for an invalid sale', async () => {
    const pet: PetEntity = petsList[0];
    await expect(()=> service.deletePetSale("0", pet.id)).rejects.toHaveProperty("message", "The sale with the given id was not found"); 
  });

  it('deletePetToSale should thrown an exception for an non asocciated pet', async () => {
    const newPet: PetEntity = await petRepository.save({
      name: faker.name.firstName(), 
      price: faker.datatype.number(),
      age: faker.datatype.number({ min: 1, max: 10 }),
      race: faker.animal.dog(),
      specie: faker.helpers.arrayElement(['Gato', 'Perro']),
      color: faker.color.human(),
      description: faker.lorem.sentence()
    });

    await expect(()=> service.deletePetSale(sale.id, newPet.id)).rejects.toHaveProperty("message", "The pet with the given id is not associated to the sale"); 
  });

});
