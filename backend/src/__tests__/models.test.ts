import * as supertest from 'supertest';
import app from '../app';
import database from '../config/database';
import { User } from '../models/User';
import { GenerateHash } from './../utils/bcript';

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
        password: await GenerateHash(admin.password),
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
      const response = await browser
        .post('/users')
        .set({ 'x-access-token': token })
        .send(user1);
      expect(response.status).toBe(201);
      const responseUser: User = response.body;

      const getUser = await browser
        .get(`/users/${response.body.id}?scope=login`)
        .set({ 'x-access-token': token });
      const user: User = getUser.body;
      expect(getUser.status).toBe(200);
      expect(user.id).toBe(responseUser.id);
      expect(user.email).toBe(responseUser.email);
      expect(user.password).toBe(responseUser.password);
      expect(user.isAdmin).toBe(responseUser.isAdmin);
      expect(user.exp).toBe(responseUser.exp);
      done();
    });
  });
});
