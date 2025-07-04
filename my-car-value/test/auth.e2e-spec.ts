import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/utils/setup-app';
import { unlink } from 'fs/promises';
import * as process from 'node:process';

describe('User module e2e tests', () => {
  let app: INestApplication;

  beforeAll(() => unlink(process.env.DB_NAME).catch(() => null));

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    setupApp(app);
    await app.init();
  });

  it('POST /auth/signup should create a user', () => {
    const email = 'test@mail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '1234' })
      .expect(201)
      .expect({ id: 1, email });
  });

  it('POST /auth/signin should success', () => {
    const email = 'test@mail.com';
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: '1234' })
      .expect(200)
      .expect({ id: 1, email });
  });
});
