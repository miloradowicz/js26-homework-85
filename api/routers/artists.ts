import express, { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import { imageUpload } from '../middleware/multer';
import Artist from '../models/Artist';

const router = express.Router();

router.get('/', async (_req, res) => {
  const artists = await Artist.find();
  res.send(artists);
});

router.post('/', imageUpload.single('photo'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await Artist.create({
      name: req.body.name ?? null,
      photoUrl: req.file?.filename ?? null,
      description: req.body.description ?? null,
    });

    res.send(artist);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return void res.status(400).send(e);
    }

    next(e);
  }
});

export default router;
