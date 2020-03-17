import * as dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

dotenv.config();

const envVar = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: port(),
  POSTGRES_HOST: str(),
  POSTGRES_PORT: port(),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str(),
  DIALECT: str(),
});

const env = {
  database:
    (envVar.isTest ? 'TEST_' : envVar.isProduction ? '' : 'DEV_') +
    envVar.POSTGRES_DB,
  username: envVar.POSTGRES_USER,
  password: envVar.POSTGRES_PASSWORD,
  host: envVar.POSTGRES_HOST,
  port: envVar.POSTGRES_PORT,
  dialect: envVar.DIALECT,
};

export default env;
