import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import env from './env';

const url =
  env.dialect +
  '://' +
  env.username +
  ':' +
  env.password +
  '@' +
  env.host +
  ':' +
  env.port +
  '/' +
  env.database;

const options = {
  modelPaths: [__dirname + '/../models'],
  logging: console.log,
};

const database = new Sequelize(url, options);

export default database;
