import express from 'express';
import { Types } from 'mongoose';

import Album from '../models/Album';
import Artist from '../models/Artist';
import { AlbumMutation } from '../types';

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
    const album = await Album.findById(id, null, {
      populate: { path: 'Artist' },
    });
    res.send(album);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

router.post('/', async (req, res, next) => {
  const missing: string[] = [];

  if (!req.body.title) {
    missing.push('title');
  }

  if (!req.body.artistId) {
    missing.push('artist');
  }

  if (!req.body.year) {
    missing.push('year');
  }

  if (missing.length) {
    res.status(400).send({
      error: `${missing.join(', ')} ${
        missing.length === 1 ? 'is' : 'are'
      } required.`,
    });
    return;
  }

  const mutation: AlbumMutation = {
    title: req.body.title,
    artist: req.body.artist,
    year: req.body.year,
    coverUrl: req.file ? req.file.filename : null,
  };

  try {
    const artist = await Artist.create(mutation);
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
