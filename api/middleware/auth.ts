import { NextFunction, Request, Response } from 'express';

import User, { Fields as UserFields } from '../models/User';

export interface RequestWithUser extends Request {
  user: UserFields;
}

const auth = async (_req: Request, res: Response, next: NextFunction) => {
  const req = _req as RequestWithUser;
  const token = req.get('Authorization');

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return void res.status(401).send({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      console.error(e);
      res.status(400).send({ error: 'Unknown error. The administrator will be notified.' });
    }
  }
};

export default auth;
