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

router.post('/sessions', async (req, res, next) => {
  const mutation: UserMutation = {
    username: req.body.username ?? null,
    password: req.body.password ?? null,
  };

  try {
    if (!mutation.username || !mutation.password) {
      return void res
        .status(400)
        .send({ error: 'username and password are required.' });
    }

    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return void res.status(400).send({ error: 'user not found.' });
    }

    if (!(await user.checkPassword(mutation.password))) {
      return void res.status(400).send({ error: 'incorrect password.' });
    }

    user.generateToken();
    await user.save();

    return void res.send({ message: 'Authenticated.', user });
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

export default router;
