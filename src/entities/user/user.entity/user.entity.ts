import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';



/* eslint-disable prettier/prettier */
import { SaleEntity } from '../../sale/sale.entity/sale.entity';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
@Unique(['username'])
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  image: string;

  @Column()
  rol: string;

  @OneToMany(() => SaleEntity, (sale) => sale.user)
  sales: SaleEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];


  @OneToOne(() => InstitutionEntity, institution => institution.user, { nullable: true })
  @JoinColumn()
  institution: InstitutionEntity;
}
