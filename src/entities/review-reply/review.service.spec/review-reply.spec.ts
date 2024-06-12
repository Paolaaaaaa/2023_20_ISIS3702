import { Repository } from 'typeorm';
import { ReviewReplyService } from '../../review-reply/review-reply.service/review-reply.service';
import { ReviewEntity } from '../../review/review.entity/review.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../../../shared/errors/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { InstitutionEntity } from '../../institution/institution.entity/institution.entity';
import { UserEntity } from '../../user/user.entity/user.entity';

describe('ReviewReplyService', () => {
  let service: ReviewReplyService;
  let reviewrepository: Repository<ReviewEntity>;
  let replies: ReviewEntity[];
  let review: ReviewEntity;
  let institutionRepository: Repository<InstitutionEntity>;
  let userRepository: Repository<UserEntity>;
  let comenter: UserEntity;
  let institution: InstitutionEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReviewReplyService],
    }).compile();

    service = module.get<ReviewReplyService>(ReviewReplyService);
    reviewrepository = module.get<Repository<ReviewEntity>>(
      getRepositoryToken(ReviewEntity),
    );

    institutionRepository = module.get<Repository<InstitutionEntity>>(
      getRepositoryToken(InstitutionEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    reviewrepository.clear();
    replies = [];
    const user_owner: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Buisness Account',
    });
    const comenter: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });
    const inst = await institutionRepository.save({
      name: faker.company.name(),
      address: faker.address.direction(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: faker.number.int(),
      schedule: faker.lorem.lines(),
      type: 'Shelter',
      user: user_owner,
      donations: null,
    });
    for (let i = 0; i < 5; i++) {
      const reply: ReviewEntity = await reviewrepository.save({
        stars: faker.number.int(),
        review: faker.lorem.text(),
        time: faker.date.anytime().toUTCString(),
        institution: inst,
        user: comenter,
      });
      replies.push(reply);
    }

    review = await reviewrepository.save({
      stars: faker.number.int(),
      review: faker.lorem.text(),
      time: faker.date.anytime().toUTCString(),
      institution: inst,
      user: comenter,
      replies: replies,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addReplyReview should add an reply to a review', async () => {
    const user_owner: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Buisness Account',
    });

    const comenter: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });
    const inst = await institutionRepository.save({
      name: faker.company.name(),
      address: faker.address.direction(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: faker.number.int(),
      schedule: faker.lorem.lines(),
      type: 'Shelter',
      user: user_owner,
      donations: null,
    });
    const review: ReviewEntity = await reviewrepository.save({
      stars: faker.number.int(),
      review: faker.lorem.text(),
      time: faker.date.anytime().toUTCString(),
      institution: inst,
      user: comenter,
      replies: [],
    });
    const newReply: ReviewEntity = await reviewrepository.save({
      stars: faker.number.int(),
      review: faker.lorem.text(),
      time: faker.date.anytime().toUTCString(),
      institution: inst,
      user: comenter,
    });

    const result = await service.addReplyReview(review.id, newReply);
    expect(result.replies.length).toBe(1);
    expect(result.replies[0].review).toBe(newReply.review);
  });

  it('addReplyReview should thrown exception for an invalid reply', async () => {
    const user_owner: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Buisness Account',
    });

    const comenter: UserEntity = await userRepository.save({
      username: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
      rol: 'Personal Account',
    });
    const inst = await institutionRepository.save({
      name: faker.company.name(),
      address: faker.address.direction(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      yearsOfExistence: faker.number.int(),
      schedule: faker.lorem.lines(),
      type: 'Shelter',
      user: user_owner,
      donations: null,
    });
    const review: ReviewEntity = await reviewrepository.save({
      stars: faker.number.int(),
      review: '',
      time: faker.date.anytime().toUTCString(),
      institution: inst,
      user: comenter,
      replies: [],
    });

    await expect(() =>
      service.addReplyReview(review.id, review),
    ).rejects.toHaveProperty('message', 'The reply is not valid');
  });

  it('findReplyByReviewIdReplyId should return reply by review', async () => {
    const response = await reviewrepository.save(review);

    const stored_reply: ReviewEntity = await service.findReplyByReviewIdReplyId(
      response.id,
      response.replies[0].id,
    );

    expect(stored_reply).not.toBeNull();
  });

  it('findReplyByReviewIdReplyId should throw an exception for an invalid reply', async () => {
    await expect(() =>
      service.findReplyByReviewIdReplyId(review.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The reply with the given id was not found',
    );
  });

  it('findReplyByReviewIdReplyId should throw an exception for an invalid museum', async () => {
    const reply: ReviewEntity = replies[0];
    await expect(() =>
      service.findReplyByReviewIdReplyId('0', reply.id),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });
  it('findRepliesByReviewId should return replies by review', async () => {
    const response = await reviewrepository.save(review);

    const replies: ReviewEntity[] = await service.findRepliesByReviewId(
      response.id,
    );
    expect(replies.length).toBe(5);
  });

  it('findRepliesByReviewId should throw an exception for an invalid review', async () => {
    await expect(() =>
      service.findRepliesByReviewId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });

  it('deleteReplyReview should remove an reply from a review', async () => {
    const response = await reviewrepository.save(review);

    const reply: ReviewEntity = response.replies[0];

    await service.deleteReplyReview(response.id, reply.id);

    const revstored: ReviewEntity = await reviewrepository.findOne({
      where: { id: review.id },
      relations: ['replies', 'parentReview'],
    });
    const delReply: ReviewEntity = revstored.replies.find(
      (a) => a.id === reply.id,
    );

    expect(delReply).toBeUndefined();
  });

  it('deleteReplyToReview should thrown an exception for an invalid artwork', async () => {
    await expect(() =>
      service.deleteReplyReview(review.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The reply with the given id was not found',
    );
  });

  it('deleteReplyToReview should thrown an exception for an invalid museum', async () => {
    const reply: ReviewEntity = replies[0];
    await expect(() =>
      service.deleteReplyReview('0', reply.id),
    ).rejects.toHaveProperty(
      'message',
      'The review with the given id was not found',
    );
  });
});
