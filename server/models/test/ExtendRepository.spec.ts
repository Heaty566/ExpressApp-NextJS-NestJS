import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';

import { conInit } from '../../test/test-utils/getInit';
import { getInitMiddleware } from '../../test/test-utils/initMiddleware';
import { UserRepository } from '../../src/user/user.repository';
import { User } from '../../src/user/user.entity';
import { ExtendRepository } from '../ExtendRepository';
import { getUserInstance } from '../../test/test-utils/userMock';
import { FakeResolver } from '../../test/test-utils/fakeResolver.resolver';

describe('Repository extends method', () => {
        let app: INestApplication;
        let repository: ExtendRepository<User>;
        let user: User;

        beforeAll(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        imports: [...conInit(), TypeOrmModule.forFeature([UserRepository])],
                        providers: [FakeResolver],
                }).compile();

                app = module.createNestApplication();
                app.use(getInitMiddleware());
                await app.init();

                repository = module.get<UserRepository>(UserRepository);
        });

        //setup database
        beforeAll(async () => {
                user = await getUserInstance().save();
        });

        it('fake resolver', async () => {
                const { body } = await request(app.getHttpServer())
                        .post('/api/graphql')
                        .send({ query: `query{test}` });
                expect(body).toBeDefined();
        });

        it('should be defined', () => {
                expect(repository).toBeDefined();
        });

        describe('findOneById', () => {
                it('should return value', async () => {
                        const getUser = await repository.findOneById(user._id);
                        expect(getUser).toBeDefined();
                });
                it('should error with invalid id', async () => {
                        try {
                                await repository.findOneById('dsadsa213');
                        } catch (err) {
                                expect(err).toBeDefined();
                        }
                });
                it('should error with id does not exist', async () => {
                        const getUser = await repository.findOneById(new ObjectId());
                        expect(getUser).toBeUndefined();
                });
        });

        describe('findOneByField', () => {
                it('should return value', async () => {
                        const getUser = await repository.findOneByField('username', user.username);
                        expect(getUser).toBeDefined();
                });

                it('should error with invalid input', async () => {
                        const getUser = await repository.findOneByField('username', user.password);
                        expect(getUser).toBeUndefined();
                });
        });

        describe('isExist', () => {
                it('should return value', async () => {
                        const getUser = await repository.isExist('username', user.username);
                        expect(getUser).toBe(true);
                });

                it('should return value with id', async () => {
                        const getUser = await repository.isExist('_id', new ObjectId(user._id));
                        expect(getUser).toBe(true);
                });
                it('should return error with invalid input', async () => {
                        const getUser = await repository.isExist('username', user.password);
                        expect(getUser).toBe(false);
                });
        });

        describe('findManyByIds', () => {
                let ids;
                beforeAll(async () => {
                        await getUserInstance().save();
                        await getUserInstance().save();
                        await getUserInstance().save();

                        ids = await repository.find();
                        ids = ids.map(item => item._id);
                });
                it('should return array value', async () => {
                        const arr = await repository.findManyByIds(ids);
                        expect(arr.length).toBeGreaterThanOrEqual(3);
                });
        });

        afterAll(async () => {
                await repository.clear();
                await app.close();
        });
});
