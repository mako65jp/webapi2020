import * as supertest from 'supertest';
import app from '../app';
import database from '../config/database';
import { User } from '../models/User';
import { generateHash } from './../utils/bcript';

describe('WebAPI test', () => {
  let browser: supertest.SuperTest<supertest.Test>;
  let token = {};

  const admin = {
    email: 'admin@abc.com',
    password: 'adminadmin',
    isAdmin: true,
  };
  const user1 = {
    email: 'user1@abc.com',
    password: 'user1user1',
    isAdmin: false,
  };

  beforeAll(async done => {
    browser = supertest(app);

    const users = [
      {
        email: admin.email,
        password: await generateHash(admin.password),
        isAdmin: admin.isAdmin,
      },
    ];
    await User.bulkCreate(users);

    const response = await browser.post('/login').send({
      email: admin.email,
      password: admin.password,
    });
    token = response.body.token;

    done();
  });

  afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    await database.close();
    done();
  });

  describe('ログイン', () => {
    test('OK', async done => {
      const response = await browser.post('/login').send({
        email: admin.email,
        password: admin.password,
      });
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      done();
    });

    test('パスワードNG', async done => {
      const response = await browser.post('/login').send({
        email: admin.email,
        password: 'xxxxxxx',
      });
      expect(response.status).toBe(404);
      expect(response.body.success).not.toBeTruthy();
      done();
    });
  });

  describe('パスワードは隠蔽できているか？', () => {
    test('ログインスコープならパスワードを取得できる', async done => {
      const response = await browser
        .get('/users?scope=login')
        .set({ 'x-access-token': token });
      expect(response.status).toBe(200);
      const users: User[] = response.body;
      users.forEach(user => {
        expect(user).toHaveProperty('password');
      });
      done();
    });

    test('ログインスコープ以外ではパスワードを取得できない', async done => {
      const response = await browser
        .get('/users')
        .set({ 'x-access-token': token });
      expect(response.status).toBe(200);
      const users: User[] = response.body;
      users.forEach(user => {
        expect(user).not.toHaveProperty('password');
      });
      done();
    });
  });

  describe('Userモデル', () => {
    test('Id指定取得', async done => {
      const response = await browser
        .get('/users/1')
        .set({ 'x-access-token': token });
      expect(response.status).toBe(200);
      const user: User = response.body;
      expect(user.email).toBe(admin.email);
      expect(user.isAdmin).toBe(admin.isAdmin);
      done();
    });

    test('存在しないId指定、取得できない', async done => {
      const response = await browser
        .get('/users/1000')
        .set({ 'x-access-token': token });
      expect(response.status).toBe(404);
      done();
    });

    test('登録', async done => {
      const responsePost = await browser
        .post('/users')
        .set({ 'x-access-token': token })
        .send(user1);
      expect(responsePost.status).toBe(201);
      const postedUser = new User(responsePost.body);

      const responseGet = await browser
        .get(`/users/${responsePost.body.id}?scope=login`)
        .set({ 'x-access-token': token });
      expect(responseGet.status).toBe(200);
      const getUser = new User(responseGet.body);

      expect(getUser.email).toBe(postedUser.email);
      expect(getUser.password).toBe(postedUser.password);
      expect(getUser.isAdmin).toBe(postedUser.isAdmin);
      expect(getUser.exp).toBe(postedUser.exp);
      done();
    });

    test('変更', async done => {
      const responsePut = await browser
        .put('/users/2')
        .set({ 'x-access-token': token })
        .send({ isAdmin: true });
      expect(responsePut.status).toBe(200);
      const putUser = new User(responsePut.body);
      expect(putUser.email).toBe(user1.email);
      expect(putUser.isAdmin).not.toBe(user1.isAdmin);
      done();
    });

    test('パスワード変更', async done => {
      const responsePut = await browser
        .put('/users/2')
        .set({ 'x-access-token': token })
        .send({ password: '0987654321' });
      expect(responsePut.status).toBe(200);
      const putUser = new User(responsePut.body);
      expect(putUser.email).toBe(user1.email);
      expect(putUser.comparePassword('0987654321')).toBeTruthy();
      done();
    });
  });
});
