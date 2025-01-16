import express, { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import auth, { RequestWithUser } from '../middleware/auth';
import { imageUpload } from '../multer';
import Artist from '../models/Artist';

const router = express.Router();

router.get('/', auth, async (_req, res, next) => {
  try {
    const artists = await Artist.find();
    res.send(artists);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send(e);
    } else {
      next(e);
    }
  }
});

router.post('/', [auth, imageUpload.single('photo')], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await Artist.create({
      name: req.body.name ?? null,
      photoUrl: req.file?.filename ?? null,
      description: req.body.description ?? null,
    });
    res.send(artist);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send(e);
    } else {
      next(e);
    }
  }
});

export default router;
