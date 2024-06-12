import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ReviewEntity } from '../review.entity/review.entity';
import { ReviewService } from '../review.service/review.service';
import { UserEntity } from '../../user/user.entity/user.entity';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';

describe('ReviewService', () => {
  let service: ReviewService;
  let repository: Repository<ReviewEntity>;
  let user_rep: Repository<UserEntity>;
  let institution_rep: Repository<InstitutionEntity>;
  let reviewList: ReviewEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReviewService],
    }).compile();

    user_rep = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    institution_rep = module.get<Repository<InstitutionEntity>>(
      getRepositoryToken(InstitutionEntity),
    );

    service = module.get<ReviewService>(ReviewService);
    repository = module.get<Repository<ReviewEntity>>(
      getRepositoryToken(ReviewEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    reviewList = [];

    const user: UserEntity = await user_rep.save({
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    const user_owner: UserEntity = await user_rep.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    const institution: InstitutionEntity = await institution_rep.save({
      name: faker.company.name(),
      address: faker.address.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: 50,
      schedule: faker.lorem.words(),
      type: 'Shelter',
      user: user_owner,
      pets: [], // add pets if required
      reviews: [], // add reviews if required
      donations: [], // add donations if required
    });
    for (let i = 0; i < 5; i++) {
      const review: ReviewEntity = await repository.save({
        stars: faker.number.int(5),
        review: faker.lorem.sentence(),
        time: faker.date.anytime().toUTCString(),
        user: user, // Set user here
        institution: institution, // Set institution here
        replies: [], // Set replies here if needed
        parentReview: null, // Set parent review here if needed
      });
      reviewList.push(review);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all reviews', async () => {
    const reviews: ReviewEntity[] = await service.findAll();
    expect(reviews).not.toBeNull();
    expect(reviews.length).toBe(reviewList.length);
  });

  it('findOne should return a review by id', async () => {
    const strReview: ReviewEntity = reviewList[0];
    const review: ReviewEntity = await service.findOne(strReview.id);
    expect(review).not.toBeNull();
    expect(review.stars).toEqual(strReview.stars);
    expect(review.review).toEqual(strReview.review);
  });

  it('findOne should throw an error if review does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toThrowError();
  });

  it('create should create a new review', async () => {
    const user: UserEntity = await user_rep.save({
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    const user_owner: UserEntity = await user_rep.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    const institution: InstitutionEntity = await institution_rep.save({
      name: faker.company.name(),
      address: faker.address.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: faker.number.int(50),
      schedule: faker.lorem.words(),
      type: 'Shelter',
      user: user_owner,
      pets: [], // add pets if required
      reviews: [], // add reviews if required
      donations: [], // add donations if required
    });

    const review: ReviewEntity = {
      stars: faker.number.int(5),
      review: faker.lorem.sentence(),
      time: faker.date.anytime().toUTCString(),
      user: user, // Set user here
      institution: institution, // Set institution here
      replies: [], // Set replies here if needed
      parentReview: null, // Set parent review here if needed
      id: '',
    };
    const newReview: ReviewEntity = await service.create(review);
    expect(newReview).not.toBeNull();

    const strReview: ReviewEntity = await repository.findOne({
      where: { id: newReview.id },
    });
    expect(strReview).not.toBeNull();
    expect(strReview.stars).toEqual(newReview.stars);
    expect(strReview.review).toEqual(newReview.review);
  });

  it('delete should delete an existing review', async () => {
    const review: ReviewEntity = reviewList[0];
    await service.delete(review.id);
    const delReview: ReviewEntity = await repository.findOne({
      where: { id: review.id },
    });
    expect(delReview).toBeNull();
  });

  it('delete should throw an error if review does not exist', async () => {
    await expect(() => service.delete('0')).rejects.toThrowError();
  });
});
