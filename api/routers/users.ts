import express from 'express';
import { Error } from 'mongoose';

import User from '../models/User';
import auth, { RequestWithUser } from '../middleware/auth';

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
      return void res.status(400).send(e);
    }

    next(e);
  }
});

router.delete('/sessions', auth, async (_req, res, next) => {
  const req = _req as RequestWithUser;

  const user = await User.findById(req.user._id);

  user?.generateToken();
  await user?.save();

  res.send({ message: 'Logged out' });
});

router.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return void res.status(401).send({ errors: { username: { name: 'username', message: 'user not found.' } } });
    }

    if (!(await user.checkPassword(req.body.password))) {
      return void res.status(401).send({ errors: { password: { name: 'password', message: 'incorrect password.' } } });
    }

    user.generateToken();
    await user.save();

    return void res.send({ message: 'Authenticated', user });
  } catch (e) {
    if (e instanceof Error) {
      return void res.status(400).send({ error: e.message });
    }

    next(e);
  }
});

export default router;
