import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity/user.entity';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
@Entity()
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  stars: number;
  @Column()
  review: string;
  @Column()
  time: string;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user: UserEntity;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.reviews)
  institution: InstitutionEntity;

  @OneToMany(() => ReviewEntity, (reply) => reply.parentReview)
  replies: ReviewEntity[];

  @ManyToOne(() => ReviewEntity, (parentReview) => parentReview.replies, {
    nullable: true,
  })
  parentReview: ReviewEntity;
}
