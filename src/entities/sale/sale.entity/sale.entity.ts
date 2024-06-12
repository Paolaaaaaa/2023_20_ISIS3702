import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { UserEntity } from '../../user/user.entity/user.entity';
import { PetEntity } from '../../pet/pet.entity/pet.entity';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';

@Entity()
export class SaleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  total: number;

  @ManyToOne(() => UserEntity, (user) => user.sales)
  user: UserEntity;

  @OneToMany(() => PetEntity, (pet) => pet.sale, { nullable: true })
  pets: PetEntity[];

  @ManyToOne(() => InstitutionEntity, (institution) => institution.donations, {
    nullable: true,
  })
  institution: InstitutionEntity;

  @Column()
  type: string;
}
