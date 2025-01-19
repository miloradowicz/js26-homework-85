import express from 'express';
import { Error } from 'mongoose';

import auth, { RequestWithUser } from '../middleware/auth';
import TrackHistory from '../models/TrackHistory';

const router = express.Router();

router.get('/', auth, async (_req, res, next) => {
  const req = _req as RequestWithUser;

  try {
    const trackHistory = await TrackHistory.aggregate([
      {
        $match: {
          user: req.user._id,
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
        $replaceWith: {
          $setField: {
            field: 'track',
            input: '$$ROOT',
            value: {
              $unsetField: { field: '__v', input: '$track' },
            },
          },
        },
      },
      {
        $replaceWith: {
          $setField: {
            field: 'track',
            input: '$$ROOT',
            value: {
              $unsetField: { field: 'album', input: '$track' },
            },
          },
        },
      },
      {
        $replaceWith: {
          $setField: {
            field: 'album',
            input: '$$ROOT',
            value: { $unsetField: { field: '__v', input: '$album' } },
          },
        },
      },
      {
        $replaceWith: {
          $setField: {
            field: 'album',
            input: '$$ROOT',
            value: { $unsetField: { field: 'artist', input: '$album' } },
          },
        },
      },
      {
        $replaceWith: {
          $setField: {
            field: 'artist',
            input: '$$ROOT',
            value: { $unsetField: { field: '__v', input: '$artist' } },
          },
        },
      },
    ]).sort({ date: -1 });

    res.send(trackHistory);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send(e);
    } else {
      next(e);
    }
  }
});

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
