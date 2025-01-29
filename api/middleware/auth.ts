import { NextFunction, Request, Response } from 'express';
import * as core from 'express-serve-static-core';

import User, { Fields as UserFields } from '../models/User';

export interface RequestWithUser<T = core.ParamsDictionary> extends Request<T> {
  user: UserFields;
}

const auth = async (_req: Request, res: Response, next: NextFunction) => {
  const req = _req as RequestWithUser;
  const token = req.get('Authorization');

  const user = await User.findOne({ token });

  if (!user) {
    return void res.status(401).send({ error: 'Token not found' });
  }

  if (!user.token) {
    return void res.status(401).send({ error: 'User logged out' });
  }

  req.user = user;
  next();
};

export default auth;
