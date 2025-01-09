import express from 'express';

import { UserMutation } from '../types';
import User from '../models/User';
import Artist from '../models/Artist';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const mutation: UserMutation = {
    username: req.body.username ?? null,
    password: req.body.password ?? null,
  };

  try {
    const user = new User(mutation);
    user.generateToken();
    await user.save();
    res.send(user);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

export default router;
