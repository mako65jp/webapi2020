import { Request, Response } from 'express';
import { UpdateOptions, DestroyOptions } from 'sequelize';
import { User } from '../models/User';

export class UsersController {
  public index(req: Request, res: Response): void {
    const scope = req.query['scope'] || 'defaultScope';
    User.scope(scope)
      .findAll<User>({})
      .then((users: Array<User>) => {
        res.json(users);
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public create(req: Request, res: Response): void {
    const scope = req.query['scope'] || 'defaultScope';
    User.scope(scope)
      .create<User>(req.body)
      .then((user: User) => res.status(201).json(user))
      .catch((err: Error) => res.status(500).json(err));
  }

  public show(req: Request, res: Response): void {
    const userId = Number(req.params.id);
    const scope = req.query['scope'] || 'defaultScope';
    User.scope(scope)
      .findByPk<User>(userId)
      .then((user: User | null) => {
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ errors: ['Node not found'] });
        }
      })
      .catch((err: Error) => res.status(500).json(err));
  }

  public update(req: Request, res: Response): void {
    const userId = Number(req.params.id);
    const update: UpdateOptions = {
      where: { id: userId },
      limit: 1,
    };

    const scope = req.query['scope'] || 'defaultScope';
    User.scope(scope)
      .update(req.body, update)
      .then(() => res.status(202).json({ data: 'success' }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public delete(req: Request, res: Response): void {
    const userId = Number(req.params.id);
    const options: DestroyOptions = {
      where: { id: userId },
      limit: 1,
    };

    User.destroy(options)
      .then(() => res.status(204).json({ data: 'success' }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public logout(_req: Request, res: Response): void {
    res.set('x-access-token', undefined).redirect('/login');
  }
}
