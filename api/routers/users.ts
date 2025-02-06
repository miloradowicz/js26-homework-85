import express from 'express';
import { Error } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import assert from 'assert';

import config from '../config';
import { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { imageUpload } from '../middleware/multer';
import User from '../models/User';

const client = new OAuth2Client(config.google.clientId, config.google.clientSecret);

const router = express.Router();

router.post('/', imageUpload.single('avatar'), async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username ?? null,
      password: req.body.password ?? null,
      displayName: req.body.displayName ?? null,
      avatarUrl: req.file?.filename ?? null,
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

router.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return void res.status(401).send({
        errors: {
          username: { name: 'username', message: 'User not found.' },
        },
      });
    }

    if (!(await user.checkPassword(req.body.password))) {
      return void res.status(401).send({
        errors: {
          password: { name: 'password', message: 'Incorrect password.' },
        },
      });
    }

    user.generateToken();
    await user.save();

    return void res.send({ user });
  } catch (e) {
    if (e instanceof Error) {
      return void res.status(400).send({ error: e.message });
    }

    next(e);
  }
});

router.delete('/sessions', permit('user', 'admin'), async (_req, res) => {
  const req = _req as RequestWithUser;

  assert(req.user);

  const user = await User.findById(req.user._id);

  assert(user);

  user.clearToken();
  await user.save();

  res.send({ user: null });
});

router.post('/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return void res.status(400).send({ error: 'Google login error!' });
    }

    const email = payload.email;
    const id = payload.sub;
    const displayName = payload.name;
    const avatarUrl = payload.picture;

    if (!email) {
      return void res.status(400).send({ error: 'Not enough user data to continue' });
    }

    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = new User({
        username: email,
        password: crypto.randomUUID(),
        googleId: id,
        displayName,
        avatarUrl,
      });
    }

    user.generateToken();
    await user.save();

    return void res.send({ user });
  } catch (e) {
    return void next(e);
  }
});

export default router;
