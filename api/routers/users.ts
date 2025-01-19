import express from 'express';
import { Error } from 'mongoose';

import User from '../models/User';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    user.generateToken();
    await user.save();
    res.send(user);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send(e);
    } else {
      next(e);
    }
  }
});

router.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return void res.status(400).send({ errors: { username: { name: 'username', message: 'user not found.' } } });
    }

    if (!(await user.checkPassword(req.body.password))) {
      return void res.status(400).send({ errors: { password: { name: 'password', message: 'incorrect password.' } } });
    }

    user.generateToken();
    await user.save();

    return void res.send({ message: 'Authenticated', user });
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

export default router;
