import express from 'express';
import { Error, Types } from 'mongoose';

import Artist from '../models/Artist';
import Album from '../models/Album';
import Track from '../models/Track';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const _album = req.query.album as string | undefined;

  try {
    if (_album) {
      const album = await Album.findById(_album).populate('artist');

      if (!album) {
        return void res.status(404).send({ error: 'album not found.' });
      }

      const tracks = await Track.find({ album: album._id }).sort('trackNum');

      return void res.send({ tracks, album });
    }

    const tracks = await Track.find(_album ? { album: _album } : {});
    res.send({ tracks });
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
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
      res.status(400).send(e);
    } else {
      next(e);
    }
  }
});

export default router;
