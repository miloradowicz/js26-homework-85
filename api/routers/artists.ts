import express, { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { imageUpload } from '../middleware/multer';
import Artist from '../models/Artist';

const router = express.Router();

router.post(
  '/',
  permit('user', 'admin'),
  imageUpload.single('photo'),
  async (_req: Request, res: Response, next: NextFunction) => {
    const req = _req as RequestWithUser;

    try {
      const artist = await Artist.create({
        name: req.body.name ?? null,
        photoUrl: req.file?.filename ?? null,
        description: req.body.description ?? null,
        uploadedBy: req.user?._id ?? null,
      });

      res.send(artist);
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        return void res.status(400).send(e);
      }

      next(e);
    }
  }
);

router.get('/', async (_req, res) => {
  const req = _req as RequestWithUser;

  const filter = !req.user
    ? { isPublished: true }
    : req.user.role !== 'admin'
    ? { $or: [{ isPublished: true }, { uploadedBy: req.user }] }
    : {};
  const artists = await Artist.find(filter);

  res.send(artists);
});

router.patch('/:id/togglePublished', permit('admin'), async (_req, res, next) => {
  const req = _req as RequestWithUser<{ id: string }>;
  const id = req.params.id;

  try {
    const artist = await Artist.findById(id);

    if (!artist) {
      return void res.status(404).send({ error: 'Artist not found.' });
    }

    if (!req.user || req.user.role !== 'admin') {
      return void res.status(403).send({ error: 'Unauthorized' });
    }

    artist.isPublished = !artist.isPublished;
    await artist.save({ validateModifiedOnly: true });
    res.send(artist);
  } catch (e) {
    if (e instanceof Error.CastError) {
      return void res.status(400).send({ error: 'Invalid id' });
    }

    next(e);
  }
});

router.delete('/:id', permit('user', 'admin'), async (_req, res, next) => {
  const req = _req as RequestWithUser<{ id: string }>;
  const id = req.params.id;

  try {
    const artist = await Artist.findById(id);

    if (!artist) {
      return void res.status(404).send({ error: 'Artist not found.' });
    }

    if (req.user?.role !== 'admin' && (!req.user || !artist.uploadedBy.equals(req.user._id))) {
      return void res.status(403).send({ error: 'Unauthorized' });
    }

    if (req.user?.role !== 'admin' && artist.isPublished) {
      return void res.status(403).send({ error: 'Cannot delete published artist' });
    }

    await artist.deleteOne();
    res.send(null);
  } catch (e) {
    if (e instanceof Error.CastError) {
      return void res.status(400).send({ error: 'Invalid id' });
    }

    next(e);
  }
});

export default router;
