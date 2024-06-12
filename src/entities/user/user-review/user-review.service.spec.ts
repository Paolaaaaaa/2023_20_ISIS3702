import { Repository } from 'typeorm';
import { UserReviewService } from './user-review.service';
import { UserEntity } from '../user.entity/user.entity';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UserReviewService', () => {
  let service: UserReviewService;
  let userRepository: Repository<UserEntity>;
  let reviewRepository: Repository<ReviewEntity>;
  let user: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserReviewService],
    }).compile();

    service = module.get<UserReviewService>(UserReviewService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    reviewRepository = module.get<Repository<ReviewEntity>>(
      getRepositoryToken(ReviewEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    userRepository.clear();
    reviewRepository.clear();

    user = await userRepository.save({
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
      reviews: [],
    });

    for (let i = 0; i < 5; i++) {
      const review: ReviewEntity = await reviewRepository.save({
        stars: faker.number.int(5),
        review: faker.lorem.sentence(),
        time: faker.date.anytime().toUTCString(),
        user: user,
        institution: null,
        replies: [],
        parentReview: null,
      });
      user.reviews.push(review);
    }
    await userRepository.save(user);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getReviewsForUser should return reviews for the user', async () => {
    const retrievedReviews: ReviewEntity[] = await service.getReviewsForUser(user.id);
    expect(retrievedReviews.length).toBe(5); // Assuming 5 reviews were added to the user
  });

  it('addReviewToUser should add a review to a given user', async () => {

    const newReview: ReviewEntity = await reviewRepository.save({
      stars: faker.number.int(5),
      review: faker.lorem.sentence(),
      time: faker.date.anytime().toUTCString(),
      user: user, // Set user here
      institution: null, // Set institution here
      replies: [], // Set replies here if needed
      parentReview: null, // Set parent review here if needed
    });
    const review: ReviewEntity = await service.addReviewToUser(user.id, newReview.id);

    const userWithReview: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['reviews'],
    });

    expect(review).toBeDefined();
    expect(userWithReview.reviews.length).toBe(6); // Assuming a new review was added
    expect(userWithReview.reviews[5].id).toBe(review.id);
  });

  it('associateReviewsToUser should associate reviews with a user', async () => {
    const reviews: ReviewEntity[] = [];
    for (let i = 0; i < 3; i++) {
      const review: ReviewEntity = await reviewRepository.save({
        stars: faker.number.int(5),
        review: faker.lorem.sentence(),
        time: faker.date.anytime().toUTCString(),
        user: user,
        institution: null,
        replies: [],
        parentReview: null,
      });
      reviews.push(review);
    }

    await service.associateReviewsToUser(user.id, reviews);

    const userWithReviews: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['reviews'],
    });

    expect(userWithReviews.reviews.length).toBe(3); // Assuming 3 additional reviews were associated
  });

  it('deleteReviewFromUser should remove a review associated with a user', async () => {
    const review: ReviewEntity = await reviewRepository.save({
      stars: faker.number.int(5),
      review: faker.lorem.sentence(),
      time: faker.date.anytime().toUTCString(),
      user: user,
      institution: null,
      replies: [],
      parentReview: null,
    });

    user.reviews.push(review);
    await userRepository.save(user);

    await service.deleteReviewFromUser(user.id, review.id);

    const userWithoutReview: UserEntity = await userRepository.findOne({
      where: { id: user.id },
      relations: ['reviews'],
    });

    expect(userWithoutReview.reviews.length).toBe(5); // Assuming 1 review was deleted
  });

  // Add more test cases here...

});
