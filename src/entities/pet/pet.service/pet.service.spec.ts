import { Test, TestingModule } from '@nestjs/testing';
import { PetService } from './pet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PetEntity } from '../pet.entity/pet.entity';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('PetService', () => {
  let service: PetService;
  let repository: Repository<PetEntity>;
  let petList: PetEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PetService],
    }).compile();

    service = module.get<PetService>(PetService);
    repository = module.get<Repository<PetEntity>>(
      getRepositoryToken(PetEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    petList = [];
    for (let i = 0; i < 5; i++) {
      const pet: PetEntity = await repository.save({
        name: faker.person.firstName(),
        price: faker.number.int(),
        age: faker.number.int(),
        race: faker.lorem.word(),
        specie: faker.lorem.word(),
        color: faker.lorem.word(),
        description: faker.lorem.sentence()
      })
      petList.push(pet);
    }
}

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all pets', async () => {
    const pets: PetEntity[] = await service.findAll();
    expect(pets).not.toBeNull();
    expect(pets).toHaveLength(petList.length);
  });

  it('findOne should return a pet by id', async () => {
    const storedPet: PetEntity = petList[0];
    const pet: PetEntity = await service.findById(storedPet.id);
    expect(pet).not.toBeNull();
    expect(pet.name).toEqual(storedPet.name);
    expect(pet.price).toEqual(storedPet.price);
    expect(pet.age).toEqual(storedPet.age);
    expect(pet.race).toEqual(storedPet.race);
    expect(pet.specie).toEqual(storedPet.specie);
    expect(pet.color).toEqual(storedPet.color);
    expect(pet.description).toEqual(storedPet.description);
  });

  it('findOne should throw an error when the pet does not exist', async () => {
    await expect(() => service.findById('0')).rejects.toHaveProperty(
      'message',
      'The pet with the given id was not found',
    );
  });

  it('create should return a new pet', async () => {
    const pet: PetEntity = {
      id: "",
      name: faker.person.firstName(),
      price: faker.number.int(),
      age: faker.number.int(),
      race: faker.lorem.word(),
      specie: faker.lorem.word(),
      color: faker.lorem.word(),
      description: faker.lorem.sentence(),
      institution: null,
      sale: null,
    }

    const newPet: PetEntity = await service.create(pet);
    expect(newPet).not.toBeNull();

    const storedPet: PetEntity = await repository.findOne({
      where: { id: newPet.id }})
    expect(storedPet).not.toBeNull();
    expect(storedPet.name).toEqual(newPet.name)
    expect(storedPet.price).toEqual(newPet.price)
    expect(storedPet.age).toEqual(newPet.age)
    expect(storedPet.race).toEqual(newPet.race)
    expect(storedPet.specie).toEqual(newPet.specie)
    expect(storedPet.color).toEqual(newPet.color)
    expect(storedPet.description).toEqual(newPet.description)
  });

  it('update should return an updated pet', async () => {
    const pet: PetEntity = petList[0];
    pet.name = "Updated name";
    pet.price = 1000;

    const updatedPet: PetEntity = await service.update(pet.id, pet);
    expect(updatedPet).not.toBeNull();

    const storedPet: PetEntity = await repository.findOne({
      where: { id: pet.id }})
    expect(storedPet).not.toBeNull();
    expect(storedPet.name).toEqual(pet.name)
    expect(storedPet.price).toEqual(pet.price)
  });

  it('update should throw an exception for an invalid pet', async () => {
    let pet: PetEntity = petList[0];
    pet = {
      ...pet, name: "Updated name", price: 1000
    }
    await expect(() => service.update('0', pet)).rejects.toHaveProperty(
      'message',
      'The pet with the given id was not found',
    );
  });

  it('delete should remove a pet', async () => {
    const pet: PetEntity = petList[0];
    await service.delete(pet.id);

    const delPet: PetEntity = await repository.findOne({
      where: { id: pet.id }})
    expect(delPet).toBeNull();
  });

  it('delete should throw an exception for an invalid pet', async () => {
    const pet: PetEntity = petList[0];
    await service.delete(pet.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The pet with the given id was not found',
    );
  });

});
