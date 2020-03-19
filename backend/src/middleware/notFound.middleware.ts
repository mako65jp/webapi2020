import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const message = 'Resource not found';
  res.status(404).send(message);
};
