import { Repository } from 'typeorm';
import { UserService } from '../user.service/user.service';
import { UserEntity } from '../user.entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let userList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    userList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await repository.save({
        username: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.avatar(),
        rol: 'Personal Account',
      });
      userList.push(user);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all users', async () => {
    const users: UserEntity[] = await service.findAll();
    expect(users).not.toBeNull();
    expect(users).toHaveLength(userList.length);
  });

  it('findOne should return a user by id', async () => {
    const existingUser: UserEntity = userList[0];
    const user: UserEntity = await service.findOne(existingUser.id);
    expect(user).not.toBeNull();
    expect(user.email).toEqual(existingUser.email);
    expect(user.image).toEqual(existingUser.image);
    expect(user.password).toEqual(existingUser.password);
    expect(user.rol).toEqual(existingUser.rol);
    expect(user.username).toEqual(existingUser.username);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('create should return a new user', async () => {
    const new_user: UserEntity = {
      id: '',
      username:faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
      sales: [],
      reviews: [],
      institution: null,
    };

    const newUser: UserEntity = await service.create(new_user);
    expect(newUser).not.toBeNull();

    const newstrUser: UserEntity = await repository.findOne({
      where: { id: new_user.id },
    });
    expect(newstrUser).not.toBeNull();
    expect(newstrUser.username).toEqual(new_user.username);
    expect(newstrUser.email).toEqual(new_user.email);
    expect(newstrUser.password).toEqual(new_user.password);
    expect(newstrUser.image).toEqual(new_user.image);
    expect(newstrUser.rol).toEqual(new_user.rol);
  });

  it('update should modify a user', async () => {
    const user_0: UserEntity = userList[0];
    user_0.username = 'New name';
    user_0.password = 'nuevoemail';

    const upUser: UserEntity = await service.update(user_0.id, user_0);
    expect(upUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({
      where: { id: upUser.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.username).toEqual(user_0.username);
    expect(storedUser.email).toEqual(user_0.email);
  });

  it('update should throw an exception for an invalid user', async () => {
    const user_0: UserEntity = userList[0];
    user_0.username = 'New name';
    user_0.email = 'nuevoemail';

    await expect(() => service.update('0', user_0)).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('delete should remove a user', async () => {
    const user: UserEntity = userList[0];
    await service.delete(user.id);

    const del_user: UserEntity = await repository.findOne({
      where: { id: user.id },
    });
    expect(del_user).not.toBeNull();
    expect(del_user.email).toEqual('deleted');
    expect(del_user.password).toEqual('Deleted password');
    expect(del_user.image).toEqual(user.image);
    expect(del_user.rol).toEqual(user.rol);
  });

  it('delete should throw an exception for an invalid user', async () => {
    const user_0: UserEntity = userList[0];
    await service.delete(user_0.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findOneuser should return user', async () => {
    const user_0: UserEntity = userList[0];
    const found_user = await service.findOneUser(user_0.username);
    expect(found_user).not.toBeNull();
    expect(found_user.username).toEqual(userList[0].username)
  });

});
