import express, { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import { imageUpload } from '../multer';
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

router.post('/', imageUpload.single('cover'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const album = await Album.create({
      title: req.body.title ?? null,
      artist: req.body.artist ?? null,
      year: req.body.year ?? null,
      coverUrl: req.file?.filename ?? null,
    });
    res.send(album);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send(e);
    } else {
      next(e);
    }
  }
});

export default router;
