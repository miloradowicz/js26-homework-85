import express from 'express';

import { imageUpload } from '../multer';
import { ArtistMutation } from '../types';
import Artist from '../models/Artist';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const artists = await Artist.find();
    res.send(artists);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

router.post('/', imageUpload.single('photo'), async (req, res, next) => {
  if (!req.body.name) {
    res.status(400).send({ error: 'name is required.' });
    return;
  }

  const mutation: ArtistMutation = {
    name: req.body.name,
    photoUrl: req.file ? req.file.filename : null,
    description: req.body.description,
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
