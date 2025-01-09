import express from 'express';

import { imageUpload } from '../multer';
import { AlbumMutation } from '../types';
import Artist from '../models/Artist';
import Album from '../models/Album';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const artist = req.query.artist as string | undefined;

  try {
    if (artist) {
      if (!(await Artist.findById(artist))) {
        return void res.status(404).send({ error: 'artist not found.' });
      }

      const albums = await Album.find(artist ? { artist } : {});
      res.send(albums);
    }
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
    return;
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const album = await Album.findById(id).populate('artist');

    if (album) {
      return void res.status(404).send({ error: 'album not found.' });
    }

    res.send(album);
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
    const album = await Album.create(mutation);
    res.send(album);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

export default router;
