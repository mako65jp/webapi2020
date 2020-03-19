import * as supertest from 'supertest';
import app from '../app';
import database from '../config/database';
import { User } from '../models/User';
import { compareHash } from './../utils/bcrypt';

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

    await User.create(admin);

    const response = await browser.post('/login').send({
      email: admin.email,
      password: admin.password,
    });
    token = response.body.token;
    console.log(token);
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

    test('未登録アカウント', async done => {
      const response = await browser.post('/login').send({
        email: 'sdkfjsd',
        password: '123456789',
      });
      expect(response.status).toBe(404);
      expect(response.body.success).not.toBeTruthy();
      done();
    });

    test('アカウント空', async done => {
      const response = await browser.post('/login').send({
        email: '',
        password: '123456789',
      });
      expect(response.status).toBe(404);
      expect(response.body.success).not.toBeTruthy();
      done();
    });

    test('アカウントなし', async done => {
      const response = await browser.post('/login').send({
        password: '123456789',
      });
      expect(response.status).toBe(404);
      expect(response.body.success).not.toBeTruthy();
      done();
    });

    test('パスワード空', async done => {
      const response = await browser.post('/login').send({
        email: admin.email,
        password: '',
      });
      expect(response.status).toBe(404);
      expect(response.body.success).not.toBeTruthy();
      done();
    });

    test('パスワードなし', async done => {
      const response = await browser.post('/login').send({
        email: admin.email,
      });
      expect(response.status).toBe(404);
      expect(response.body.success).not.toBeTruthy();
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
    test('スコープを指定すれば、パスワードを取得できる', async done => {
      const response = await browser
        .get('/users?scope=withPassword')
        .set({ 'x-access-token': token });
      expect(response.status).toBe(200);
      const users: User[] = response.body;
      users.forEach(user => {
        expect(user).toHaveProperty('password');
      });
      done();
    });

    test('スコープを指定しなければ、パスワードを取得できない', async done => {
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
    test('JWTなしでユーザ一覧取得：失敗', async done => {
      const response = await browser.get('/users/');
      expect(response.status).toBe(404);
      done();
    });

    test('不正なJWTでユーザ一覧取得：失敗', async done => {
      const response = await browser
        .get('/users/')
        .set({ 'x-access-token': 'lskjdfonwoe' });
      expect(response.status).toBe(404);
      done();
    });

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
        .get(`/users/2?scope=withPassword`)
        .set({ 'x-access-token': token });
      expect(responseGet.status).toBe(200);
      const getUser = new User(responseGet.body);

      expect(getUser.email).toBe(postedUser.email);
      expect(compareHash(user1.password, getUser.password)).toBeTruthy();
      expect(getUser.isAdmin).toBe(postedUser.isAdmin);
      done();
    });

    test('パスワード変更', async done => {
      const responsePut = await browser
        .put('/users/2')
        .set({ 'x-access-token': token })
        .send({ password: '0987654321' });
      expect(responsePut.status).toBe(202);

      const responseGet = await browser
        .get(`/users/2?scope=withPassword`)
        .set({ 'x-access-token': token });
      expect(responseGet.status).toBe(200);
      const getUser = new User(responseGet.body);
      expect(getUser.email).toBe(user1.email);
      expect(compareHash('0987654321', getUser.password)).toBeTruthy();
      done();
    });

    test('変更', async done => {
      const responseBefore = await browser
        .get('/users/1?scope=withPassword')
        .set({ 'x-access-token': token });
      expect(responseBefore.status).toBe(200);

      console.log(responseBefore.body.password);

      const userBefore = new User(responseBefore.body);

      const updateUser = { email: userBefore.email + 'update' };
      const response = await browser
        .put('/users/1')
        .set({ 'x-access-token': token })
        .send(updateUser);
      expect(response.status).toBe(202);

      const responseAfter = await browser
        .get('/users/1?scope=withPassword')
        .set({ 'x-access-token': token });
      expect(responseAfter.status).toBe(200);

      console.log(responseAfter.body.password);

      const userAfter = new User(responseAfter.body);
      expect(responseAfter.body.id).toBe(responseAfter.body.id);
      expect(userAfter.email).toBe(updateUser.email);
      expect(compareHash(admin.password, userAfter.password)).toBeTruthy();
      expect(userAfter.isAdmin).toBe(userBefore.isAdmin);
      done();
    });

    test('削除', async done => {
      const response = await browser
        .delete('/users/1')
        .set({ 'x-access-token': token });
      expect(response.status).toBe(204);
      done();
    });

    test('ログアウト', async done => {
      const response = await browser
        .get('/users/logout')
        .set({ 'x-access-token': token });

      console.log(response.status);
      done();
    });
  });
});
