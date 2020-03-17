import { NextFunction, Request, Response } from 'express';
import HttpException from '../common/http-exception';

export const errorHandler = (
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  const status = error.statusCode || 500;
  const message =
    error.message || "It's not you. It's us. We are having some problems.";

  response.status(status).send(message);
};
