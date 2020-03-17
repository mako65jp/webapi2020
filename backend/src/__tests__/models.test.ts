import { GenerateHash } from './../utils/bcript';
import database from '../config/database';
import * as supertest from 'supertest';
import app from '../app';
import { User } from '../models/User';

describe('User controller', () => {
  let browser: supertest.SuperTest<supertest.Test>;
  beforeAll(async done => {
    browser = supertest(app);
    await User.bulkCreate([
      {
        email: 'aaa@abc.com',
        password: await GenerateHash('bbb'),
      },
    ]);
    done();
  });

  test('get Users', async done => {
    const response = await browser.get('/users?scope=login');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('password');
    done();
  });

  test('get Users', async done => {
    const response = await browser.get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).not.toHaveProperty('password');
    done();
  });

  test('create User', async done => {
    const requestUser = { email: 'abc@def.gh.ij', password: '12345' };
    const response = await browser.post('/users').send(requestUser);
    expect(response.status).toBe(201);

    const postedUser = await browser.get(
      `/users/${response.body.id}?scope=login`,
    );
    expect(postedUser.status).toBe(200);
    expect(postedUser.body.email).toBe(requestUser.email);
    expect(
      postedUser.body.comparePassword(requestUser.password),
    ).toBeTruthy();
    done();
  });
});

afterAll(async done => {
  // Closing the DB connection allows Jest to exit successfully.
  await database.close();
  done();
});
