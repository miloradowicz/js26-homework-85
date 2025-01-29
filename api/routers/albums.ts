import express, { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { imageUpload } from '../middleware/multer';
import Artist from '../models/Artist';
import Album from '../models/Album';

const router = express.Router();

router.post(
  '/',
  auth,
  permit('user', 'admin'),
  imageUpload.single('cover'),
  async (_req: Request, res: Response, next: NextFunction) => {
    const req = _req as RequestWithUser;

    try {
      const album = await Album.create({
        title: req.body.title ?? null,
        artist: req.body.artist ?? null,
        year: req.body.year ?? null,
        coverUrl: req.file?.filename ?? null,
        uploadedBy: req.user._id ?? null,
      });

      res.send(album);
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        return void res.status(400).send(e);
      }

      next(e);
    }
  }
);

router.get('/', async (req, res, next) => {
  const _artist = req.query.artist as string | undefined;

  try {
    let artist: ReturnType<typeof Artist.hydrate> | null = null;

    if (_artist) {
      artist = await Artist.findById(_artist);

      if (!artist) {
        return void res.status(404).send({ error: 'Artist not found' });
      }
    }

    const albums = await Album.aggregate([
      {
        $match: artist ? { artist: artist._id } : {},
      },
      {
        $lookup: {
          from: 'tracks',
          localField: '_id',
          foreignField: 'album',
          as: 'tracks',
        },
      },
      {
        $unwind: '$tracks',
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            title: '$title',
            year: '$year',
            coverUrl: '$coverUrl',
          },
          trackCount: { $count: {} },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', '$_id'],
          },
        },
      },
    ]).sort('year');

    return void res.send(artist ? { albums, artist } : { albums });
  } catch (e) {
    if (e instanceof Error.CastError) {
      return void res.status(400).send({ error: 'Invalid id' });
    }

    next();
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const album = await Album.findById(id).populate('artist');

    if (!album) {
      return void res.status(404).send({ error: 'Album not found.' });
    }

    res.send(album);
  } catch (e) {
    if (e instanceof Error.CastError) {
      return void res.status(400).send({ error: 'Invalid id' });
    }

    next(e);
  }
});

router.patch('/:id/togglePublished', auth, permit('admin'), async (_req, res, next) => {
  const req = _req as RequestWithUser<{ id: string }>;
  const id = req.params.id;

  try {
    const album = await Album.findById(id);

    if (!album) {
      return void res.status(404).send({ error: 'Album not found.' });
    }

    if (req.user.role !== 'admin') {
      return void res.status(403).send({ error: 'Unauthorized' });
    }

    album.isPublished = !album.isPublished;
    await album.save();
    res.send(album);
  } catch (e) {
    if (e instanceof Error.CastError) {
      return void res.status(400).send({ error: 'Invalid id' });
    }

    next(e);
  }
});

router.delete('/:id', auth, permit('user', 'admin'), async (_req, res, next) => {
  const req = _req as RequestWithUser<{ id: string }>;
  const id = req.params.id;

  try {
    const album = await Album.findById(id);

    if (!album) {
      return void res.status(404).send({ error: 'Album not found.' });
    }

    if (req.user.role !== 'admin' && (album.isPublished || album.uploadedBy !== req.user._id)) {
      return void res.status(403).send({ error: 'Unauthorized' });
    }

    await album.deleteOne();
    res.send(null);
  } catch (e) {
    if (e instanceof Error.CastError) {
      return void res.status(400).send({ error: 'Invalid id' });
    }

    next(e);
  }
});

export default router;
