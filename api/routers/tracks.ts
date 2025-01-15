import express from 'express';

import { imageUpload } from '../multer';
import { TrackMutation } from '../types';
import Album from '../models/Album';
import Track from '../models/Track';
import Artist from '../models/Artist';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const artist = req.query.artist as string | undefined;
  const album = req.query.album as string | undefined;

  try {
    if (album && artist) {
      return void res
        .status(400)
        .send({ error: 'either album, or artist, or neither is allowed.' });
    }

    if (artist) {
      if (!(await Artist.findById(artist))) {
        return void res.status(404).send({ error: 'artist not found.' });
      }
    }

    if (album) {
      if (!(await Album.findById(album))) {
        return void res.status(404).send({ error: 'album not found.' });
      }
    }

    const tracks = await Track.find(
      artist ? { album: await Album.find({ artist }) } : album ? { album } : {}
    );
    res.send(tracks);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

router.post('/', async (req, res, next) => {
  const mutation: TrackMutation = {
    title: req.body.title ?? null,
    album: req.body.album ?? null,
    length: req.body.length ?? null,
  };

  try {
    const track = await Track.create(mutation);
    res.send(track);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

export default router;
