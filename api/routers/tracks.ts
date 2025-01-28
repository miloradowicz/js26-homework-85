import express from 'express';
import { Document, Error, HydratedDocument, Query } from 'mongoose';

import Album from '../models/Album';
import Track from '../models/Track';
import Artist from '../models/Artist';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const _artist = req.query.artist as string | undefined;
  const _album = req.query.album as string | undefined;

  let artist: ReturnType<typeof Artist.hydrate> | null = null;
  let album: ReturnType<typeof Album.hydrate> | null = null;

  try {
    if (_artist) {
      artist = await Artist.findById(_artist);

      if (!artist) {
        return void res.status(404).send({ error: 'Artist not found.' });
      }
    }

    if (_album) {
      album = await Album.findById(_album);

      if (!album) {
        return void res.status(404).send({ error: 'Album not found.' });
      }

      const _artist = await Artist.findById(album.artist);

      if (!_artist) {
        return void res.status(404).send({ error: 'Album artist not found.' });
      }

      if (!artist) {
        artist = _artist;
      } else if (!artist._id.equals(_artist._id)) {
        return void res.status(404).send({ error: 'Album does not belong to artist' });
      }
    }

    const tracks = await Album.aggregate([
      {
        $match: {
          $and: [artist ? { artist: artist._id } : {}, album ? { _id: album._id } : {}],
        },
      },
      {
        $group: {
          _id: '$_id',
          doc: { $push: '$$ROOT' },
        },
      },
      {
        $unwind: {
          path: '$doc',
          includeArrayIndex: 'order',
        },
      },
      {
        $lookup: {
          from: 'tracks',
          localField: '_id',
          foreignField: 'album',
          as: 'tracks',
        },
      },
      {
        $unwind: {
          path: '$tracks',
        },
      },
      {
        $sort: album ? { order: 1, trackNum: 1 } : { trackNum: 1 },
      },
      {
        $replaceRoot: {
          newRoot: '$tracks',
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);

    return void res.send(album ? { tracks, album, artist } : artist ? { tracks, artist } : { tracks });
  } catch (e) {
    if (e instanceof Error.CastError) {
      return void res.status(400).send({ error: 'Invalid id' });
    }

    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const track = await Track.create({
      title: req.body.title ?? null,
      album: req.body.album ?? null,
      length: req.body.length ?? null,
    });
    res.send(track);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return void res.status(400).send(e);
    }

    next(e);
  }
});

export default router;
