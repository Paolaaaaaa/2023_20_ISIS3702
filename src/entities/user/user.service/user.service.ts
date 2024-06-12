import { Injectable, OnModuleInit }  from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity/user.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { randomInt } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return user;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    if (
      user.username == null ||
      user.username == '' ||
      user.password == null ||
      user.password == '' ||
      user.email == '' ||
      user.email == null
    )
      throw new BusinessLogicException(
        'The user is not valid',
        BusinessError.PRECONDITION_FAILED,
      );
    else {
      try {
        return await this.userRepository.save(user);
      } catch (e) {
        throw new BusinessLogicException(
          'The user is not valid',
          BusinessError.PRECONDITION_FAILED,
        );
      }
    }
  }

  async update(id: string, user: UserEntity): Promise<UserEntity> {
    const existingUser: UserEntity = await this.userRepository.findOne({
      where: { id },
    });
    if (!existingUser) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (existingUser.rol != user.rol || existingUser.email != user.email) {
      throw new BusinessLogicException(
        'Changes related to id, rol or email are not allowd',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    user.id = existingUser.id;

    return await this.userRepository.save({ ...existingUser, ...user });
  }

  async delete(id: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const user_deleted = user;
    user_deleted.id = user.id;
    user_deleted.username = '[Deleted]' + user_deleted.id;
    user_deleted.email = 'deleted';
    user_deleted.password = 'Deleted password';
    user_deleted.institution = null;

    return await this.userRepository.save({ ...user, ...user_deleted });
  }

  async findOneUser(username: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given name was not found',
        BusinessError.NOT_FOUND,
      );
    return user;
  }
}
