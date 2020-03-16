import { Sequelize } from 'sequelize';
import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';

import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';

import router from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.app.use(router);
    this.initializeErrorHandler();
  }

  // Configure Express middleware.
  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private initializeErrorHandler(): void {
    this.app.use(errorHandler);
    this.app.use(notFoundHandler);
  }
}

export default new App().app;
