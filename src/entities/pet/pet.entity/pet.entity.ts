import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
import { SaleEntity } from '../../sale/sale.entity/sale.entity';

@Entity()
export class PetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  age: number;
  @Column()
  race: string;
  @Column()
  specie: string;
  @Column()
  color: string;
  @Column()
  description: string;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.pets)
  institution: InstitutionEntity;

  @ManyToOne(() => SaleEntity, (sale) => sale.pets, { nullable: true })
  sale: SaleEntity;
}
