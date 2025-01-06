import express from 'express';
import { Types } from 'mongoose';

import { imageUpload } from '../multer';
import { AlbumMutation } from '../types';
import Album from '../models/Album';
import Artist from '../models/Artist';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const query = req.query.artist as string | undefined;

  if (query) {
    try {
      if (!(await Artist.findById(query))) {
        res.status(404).send({ error: 'artist not found.' });
        return;
      }
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).send({ error: e.message });
      } else {
        next(e);
      }
      return;
    }
  }

  try {
    const albums = await Album.find(query ? { artist: query } : {});
    res.send(albums);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const album = await Album.findById(id).populate('artist');

    if (album) {
      res.send(album);
    } else {
      res.status(404).send({ error: 'album not found.' });
    }
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

router.post('/', imageUpload.single('cover'), async (req, res, next) => {
  const mutation: AlbumMutation = {
    title: req.body.title ?? null,
    artist: req.body.artist ?? null,
    year: req.body.year ?? null,
    coverUrl: req.file?.filename ?? null,
  };

  try {
    const artist = await Album.create(mutation);
    res.send(artist);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

export default router;
