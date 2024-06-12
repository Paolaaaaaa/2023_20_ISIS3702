import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity/user.entity';
import { PetEntity } from '../../pet/pet.entity/pet.entity';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';

@Entity()
export class InstitutionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  phone: string;
  @Column()
  email: string;
  @Column()
  yearsOfExistence: number;
  @Column()
  schedule: string;
  @Column()
  type: string;

  @OneToOne(() => UserEntity, (user) => user.institution)
  user: UserEntity;

  @OneToMany(() => PetEntity, (pet) => pet.institution)
  pets: PetEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.institution)
  reviews: ReviewEntity[];

  @OneToMany(() => SaleEntity, (sale) => sale.institution)
  donations: SaleEntity[];
}
