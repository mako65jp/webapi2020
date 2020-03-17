import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  const message = 'Resource not found';

  response.status(404).send(message);
};
