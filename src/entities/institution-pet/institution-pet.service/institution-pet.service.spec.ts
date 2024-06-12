/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PetEntity } from '../../pet/pet.entity/pet.entity';
import { Repository } from 'typeorm';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { InstitutionPetService } from './institution-pet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
describe('InstitutionPetService', () => {
  let service: InstitutionPetService;
  let institutionRepository: Repository<InstitutionEntity>;
  let petRepository: Repository<PetEntity>;
  let institution: InstitutionEntity;
  let petsList : PetEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [InstitutionPetService],
    }).compile();

    service = module.get<InstitutionPetService>(InstitutionPetService);
    institutionRepository = module.get<Repository<InstitutionEntity>>(getRepositoryToken(InstitutionEntity));
    petRepository = module.get<Repository<PetEntity>>(getRepositoryToken(PetEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    petRepository.clear();
    institutionRepository.clear();

    petsList = [];
    for(let i = 0; i < 5; i++){
        const pet: PetEntity = await petRepository.save({
            name: faker.person.firstName(),
            price: faker.number.int(),
            age: faker.number.int(),
            race: faker.lorem.word(),
            specie: faker.lorem.word(),
            color: faker.lorem.word(),
            description: faker.lorem.sentence()
        })
        petsList.push(pet);
    }

    institution = await institutionRepository.save({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        yearsOfExistence: faker.number.int(),
        schedule: faker.lorem.lines(),
        type: 'Shelter',
        pets: petsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

//   it('addPetInstitution should add an pet to a institution', async () => {
//     const newPet: PetEntity = await petRepository.save({
//         name: faker.person.firstName(),
//         price: faker.number.int(),
//         age: faker.number.int(),
//         race: faker.lorem.word(),
//         specie: faker.lorem.word(),
//         color: faker.lorem.word(),
//         description: faker.lorem.sentence()
//     });

//     const newInstitution: InstitutionEntity = await institutionRepository.save({
//         name: faker.company.name(),
//         address: faker.location.streetAddress(),
//         phone: faker.phone.number(),
//         email: faker.internet.email(),
//         yearsOfExistence: faker.number.int(),
//         schedule: faker.lorem.lines(),
//         type: 'Shelter',
//     })

//     const result: InstitutionEntity = await service.addPetInstitution(newPet.id, newInstitution.id);
    
//     expect(result.pets.length).toBe(1);
//     expect(result.pets[0].name).toBe(newPet.name);
//     expect(result.pets[0].price).toBe(newPet.price);
//     expect(result.pets[0].age).toBe(newPet.age);
//     expect(result.pets[0].race).toBe(newPet.race);
//     expect(result.pets[0].specie).toBe(newPet.specie);
//     expect(result.pets[0].color).toBe(newPet.color);
//     expect(result.pets[0].description).toBe(newPet.description);
//   });

  it('addPetInstitution should thrown exception for an invalid pet', async () => {
    const newInstitution: InstitutionEntity = await institutionRepository.save({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        yearsOfExistence: faker.number.int(),
        schedule: faker.lorem.lines(),
        type: 'Shelter',
    })

    await expect(() => service.addPetInstitution(newInstitution.id, "0")).rejects.toHaveProperty("message", "The pet with the given id was not found");
  });

  it('addPetInstitution should throw an exception for an invalid institution', async () => {
    const newPet: PetEntity = await petRepository.save({
        name: faker.person.firstName(),
        price: faker.number.int(),
        age: faker.number.int(),
        race: faker.lorem.word(),
        specie: faker.lorem.word(),
        color: faker.lorem.word(),
        description: faker.lorem.sentence()
    });

    await expect(() => service.addPetInstitution("0", newPet.id)).rejects.toHaveProperty("message", "The institution with the given id was not found");
  });

  it('findPetByInstitutionIdPetId should return pet by institution', async () => {
    const pet: PetEntity = petsList[0];
    const storedPet: PetEntity = await service.findPetByInstitutionIdPetId(institution.id, pet.id, )
    expect(storedPet).not.toBeNull();
    expect(storedPet.name).toBe(pet.name);
    expect(storedPet.price).toBe(pet.price);
    expect(storedPet.age).toBe(pet.age);
    expect(storedPet.race).toBe(pet.race);
    expect(storedPet.specie).toBe(pet.specie);
    expect(storedPet.color).toBe(pet.color);
    expect(storedPet.description).toBe(pet.description);
  });

  it('findPetByInstitutionIdPetId should throw an exception for an invalid pet', async () => {
    await expect(()=> service.findPetByInstitutionIdPetId(institution.id, "0")).rejects.toHaveProperty("message", "The pet with the given id was not found"); 
  });

  it('findPetByInstitutionIdPetId should throw an exception for an invalid institution', async () => {
    const pet: PetEntity = petsList[0]; 
    await expect(()=> service.findPetByInstitutionIdPetId("0", pet.id)).rejects.toHaveProperty("message", "The institution with the given id was not found"); 
  });

  it('findPetByInstitutionIdPetId should throw an exception for a pet not associated to the institution', async () => {
    const newPet: PetEntity = await petRepository.save({
        name: faker.person.firstName(),
        price: faker.number.int(),
        age: faker.number.int(),
        race: faker.lorem.word(),
        specie: faker.lorem.word(),
        color: faker.lorem.word(),
        description: faker.lorem.sentence()
    });

    await expect(()=> service.findPetByInstitutionIdPetId(institution.id, newPet.id)).rejects.toHaveProperty("message", "The pet with the given id is not associated to the institution"); 
  });

  it('findPetsByInstitutionId should return pets by institution', async ()=>{
    const pets: PetEntity[] = await service.findPetsByInstitutionId(institution.id);
    expect(pets.length).toBe(5)
  });

  it('findPetsByInstitutionId should throw an exception for an invalid institution', async () => {
    await expect(()=> service.findPetsByInstitutionId("0")).rejects.toHaveProperty("message", "The institution with the given id was not found"); 
  });

  it('associatePetsInstitution should update pets list for a institution', async () => {
    const newPet: PetEntity = await petRepository.save({
        name: faker.person.firstName(),
        price: faker.number.int(),
        age: faker.number.int(),
        race: faker.lorem.word(),
        specie: faker.lorem.word(),
        color: faker.lorem.word(),
        description: faker.lorem.sentence()
    });

    const updatedInstitution: InstitutionEntity = await service.associatePetsInstitution(institution.id, [newPet]);
    expect(updatedInstitution.pets.length).toBe(1);
    expect(updatedInstitution.pets[0]).not.toBeNull();
    expect(updatedInstitution.pets[0].name).toBe(newPet.name);
    expect(updatedInstitution.pets[0].price).toBe(newPet.price);
    expect(updatedInstitution.pets[0].age).toBe(newPet.age);
    expect(updatedInstitution.pets[0].race).toBe(newPet.race);
    expect(updatedInstitution.pets[0].specie).toBe(newPet.specie);
    expect(updatedInstitution.pets[0].color).toBe(newPet.color);
    expect(updatedInstitution.pets[0].description).toBe(newPet.description);
  });

  it('associatePetsInstitution should throw an exception for an invalid institution', async () => {
    const newPet: PetEntity = await petRepository.save({
        name: faker.person.firstName(),
        price: faker.number.int(),
        age: faker.number.int(),
        race: faker.lorem.word(),
        specie: faker.lorem.word(),
        color: faker.lorem.word(),
        description: faker.lorem.sentence()
    });

    await expect(()=> service.associatePetsInstitution("0", [newPet])).rejects.toHaveProperty("message", "The institution with the given id was not found"); 
  });

  it('associatePetsInstitution should throw an exception for an invalid pet', async () => {
    const newPet: PetEntity = petsList[0];
    newPet.id = "0";

    await expect(()=> service.associatePetsInstitution(institution.id, [newPet])).rejects.toHaveProperty("message", "The pet with the given id was not found"); 
  });

  it('deletePetInstitution should remove an pet from a institution', async () => {
    const pet: PetEntity = petsList[0];
    
    await service.deletePetInstitution(institution.id, pet.id);

    const storedInstitution: InstitutionEntity = await institutionRepository.findOne({where: {id: institution.id}, relations: ["pets"]});
    const deletedPet: PetEntity = storedInstitution.pets.find(a => a.id === pet.id);

    expect(deletedPet).toBeUndefined();

  });

  it('deletePetInstitution should thrown an exception for an invalid pet', async () => {
    await expect(()=> service.deletePetInstitution(institution.id, "0")).rejects.toHaveProperty("message", "The pet with the given id was not found"); 
  });

  it('deletePetInstitution should thrown an exception for an invalid institution', async () => {
    const pet: PetEntity = petsList[0];
    await expect(()=> service.deletePetInstitution("0", pet.id)).rejects.toHaveProperty("message", "The institution with the given id was not found"); 
  });

  it('deletePetInstitution should thrown an exception for an non asocciated pet', async () => {
    const newPet: PetEntity = await petRepository.save({
        name: faker.person.firstName(),
        price: faker.number.int(),
        age: faker.number.int(),
        race: faker.lorem.word(),
        specie: faker.lorem.word(),
        color: faker.lorem.word(),
        description: faker.lorem.sentence()
    });

    await expect(()=> service.deletePetInstitution(institution.id, newPet.id)).rejects.toHaveProperty("message", "The pet with the given id is not associated to the institution"); 
  }); 

});