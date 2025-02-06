import express from 'express';

import permit from '../middleware/permit';
import Artist from '../models/Artist';
import Album from '../models/Album';
import Track from '../models/Track';
import User from '../models/User';

const router = express.Router();

router.get('/artists', permit('admin'), async (_req, res) => {
  const artists = await Artist.find().populate('uploadedBy', {
    role: 0,
    token: 0,
  });

  res.send(artists);
});

router.get('/albums', permit('admin'), async (_req, res) => {
  const albums = await Album.find().populate('artist').populate('uploadedBy', { role: 0, token: 0 });

  res.send(albums);
});

router.get('/tracks', permit('admin'), async (_req, res) => {
  let tracks = await Track.aggregate([
    {
      $lookup: {
        from: 'albums',
        localField: 'album',
        foreignField: '_id',
        as: 'album',
      },
    },
    {
      $unwind: {
        path: '$album',
      },
    },
    {
      $replaceWith: {
        $setField: {
          field: 'album',
          input: '$$ROOT',
          value: {
            $unsetField: {
              field: '__v',
              input: '$album',
            },
          },
        },
      },
    },
    {
      $replaceWith: {
        $setField: {
          field: 'artist',
          input: '$$ROOT',
          value: '$album.artist',
        },
      },
    },
    {
      $project: {
        __v: 0,
      },
    },
  ]);

  tracks = await Artist.populate(tracks, {
    path: 'artist',
    select: { __v: 0 },
  });
  tracks = await User.populate(tracks, {
    path: 'uploadedBy',
    select: { role: 0, token: 0, __v: 0 },
  });

  res.send(tracks);
});

export default router;
