import { Repository } from 'typeorm';
import { InstitutionReviewService } from './institution-review.service';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { UserEntity } from '../../user/user.entity/user.entity';

describe('InstitutionReviewService', () => {
  let service: InstitutionReviewService;
  let user_rep: Repository<UserEntity>;
  let institutionRepository: Repository<InstitutionEntity>;
  let reviewRepository: Repository<ReviewEntity>;
  let institution: InstitutionEntity;
  let reviews: ReviewEntity[];
  let user: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [InstitutionReviewService],
    }).compile();

    service = module.get<InstitutionReviewService>(InstitutionReviewService);
    institutionRepository = module.get<Repository<InstitutionEntity>>(
      getRepositoryToken(InstitutionEntity),
    );
    reviewRepository = module.get<Repository<ReviewEntity>>(
      getRepositoryToken(ReviewEntity),
    );

    user_rep = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    institutionRepository.clear();
    reviewRepository.clear();

    reviews = [];

    user = await user_rep.save({
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

    institution = await institutionRepository.save({
      name: faker.company.name(),
      address: faker.address.streetAddress(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: 50,
      schedule: faker.lorem.words(),
      type: 'Shelter',
      user: user_owner,
      pets: [],
      reviews: [],
      donations: [],
    });

    for (let i = 0; i < 5; i++) {
      const review: ReviewEntity = await reviewRepository.save({
        stars: faker.number.int(5),
        review: faker.lorem.sentence(),
        time: faker.date.anytime().toUTCString(),
        user: user, // Set user here
        institution: institution, // Set institution here
        replies: [], // Set replies here if needed
        parentReview: null, // Set parent review here if needed
      });
      reviews.push(review);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getReviewsForInstitution should return reviews for the institution', async () => {
    const retrievedReviews: ReviewEntity[] =
      await service.getReviewsForInstitution(institution.id);
    expect(retrievedReviews.length).toBe(5); // Assuming 5 reviews were added to the institution
  });

  it('addReviewToInstitution should add a review to a given institution', async () => {
    const user: UserEntity = await user_rep.save({
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });

    const newReview: ReviewEntity = await reviewRepository.save({
      stars: faker.number.int(5),
      review: faker.lorem.sentence(),
      time: faker.date.anytime().toUTCString(),
      user: user, // Set user here
      institution: institution, // Set institution here
      replies: [], // Set replies here if needed
      parentReview: null, // Set parent review here if needed
    });
    const addedReview: ReviewEntity = await service.addReviewToInstitution(
      institution.id,
      newReview.id
    );

    const institutionWithReview: InstitutionEntity =
      await institutionRepository.findOne({
        where: { id: institution.id },
        relations: ['reviews'],
      });

    expect(addedReview).toBeDefined();
    expect(institutionWithReview.reviews.length).toBe(6);
    expect(
      institutionWithReview.reviews[institutionWithReview.reviews.length - 1]
        .id,
    ).toBe(addedReview.id);
  });

  it('associateReviewsToInstitution should associate reviews with an institution', async () => {
    reviews = [];
    for (let i = 0; i < 3; i++) {
      const review: ReviewEntity = await reviewRepository.save({
        stars: faker.number.int(5),
        review: faker.lorem.sentence(),
        time: faker.date.anytime().toUTCString(),
        user: user,
        institution: null, // No institution initially
        replies: [],
        parentReview: null,
      });
      reviews.push(review);
    }

    await service.associateReviewsToInstitution(institution.id, reviews);

    const institutionWithReviews: InstitutionEntity =
      await institutionRepository.findOne({
        where: { id: institution.id },
        relations: ['reviews'],
      });

    expect(institutionWithReviews.reviews.length).toBe(3);
  });

  it('deleteReviewFromInstitution should remove a review associated with an institution', async () => {
    const review: ReviewEntity = await reviewRepository.save({
      stars: faker.number.int(5),
      review: faker.lorem.sentence(),
      time: faker.date.anytime().toUTCString(),
      user: user,
      institution: institution,
      replies: [],
      parentReview: null,
    });

    institution.reviews.push(review);
    await institutionRepository.save(institution);

    await service.deleteReviewFromInstitution(institution.id, review.id);

    const institutionWithoutReview: InstitutionEntity =
      await institutionRepository.findOne({
        where: { id: institution.id },
        relations: ['reviews'],
      });

    expect(institutionWithoutReview.reviews.length).toBe(0);
  });
});
