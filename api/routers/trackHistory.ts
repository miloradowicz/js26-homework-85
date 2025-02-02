import express from 'express';
import { Error } from 'mongoose';
import assert from 'assert';

import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import TrackHistory from '../models/TrackHistory';

const router = express.Router();

router.post('/', auth, permit('user', 'admin'), async (_req, res, next) => {
  const req = _req as RequestWithUser;

  try {
    const trackHistory = await TrackHistory.create({
      track: req.body.track ?? null,
      user: req.user?._id ?? null,
    });
    res.send(trackHistory);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return void res.status(400).send(e);
    }

    next(e);
  }
});

router.get('/', permit('user', 'admin'), async (_req, res) => {
  const req = _req as RequestWithUser;

  assert(req.user);

  const trackHistory = await TrackHistory.aggregate([
    {
      $match: {
        user: req.user?._id,
      },
    },
    {
      $lookup: {
        from: 'tracks',
        localField: 'track',
        foreignField: '_id',
        as: 'track',
      },
    },
    {
      $unwind: '$track',
    },
    {
      $lookup: {
        from: 'albums',
        localField: 'track.album',
        foreignField: '_id',
        as: 'album',
      },
    },
    {
      $unwind: '$album',
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'album.artist',
        foreignField: '_id',
        as: 'artist',
      },
    },
    {
      $unwind: '$artist',
    },
    {
      $project: {
        track: {
          __v: 0,
        },
        album: {
          __v: 0,
        },
        artist: {
          __v: 0,
        },
      },
    },
  ]).sort({ date: -1 });

  res.send(trackHistory);
});

export default router;
