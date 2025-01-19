import express from 'express';
import { Error } from 'mongoose';

import auth, { RequestWithUser } from '../middleware/auth';
import TrackHistory from '../models/TrackHistory';

const router = express.Router();

router.post('/', auth, async (_req, res, next) => {
  const req = _req as RequestWithUser;

  try {
    const trackHistory = await TrackHistory.create({
      track: req.body.track ?? null,
      user: req.user._id ?? null,
    });
    res.send(trackHistory);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send(e);
    } else {
      next(e);
    }
  }
});

export default router;
