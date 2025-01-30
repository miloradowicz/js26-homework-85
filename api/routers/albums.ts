import express, { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { imageUpload } from '../middleware/multer';
import Artist from '../models/Artist';
import Album from '../models/Album';

const router = express.Router();

router.post(
  '/',
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
        uploadedBy: req.user?._id ?? null,
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

router.get('/', async (_req, res, next) => {
  const req = _req as RequestWithUser;
  const _artist = req.query.artist as string | undefined;

  try {
    let artist: ReturnType<typeof Artist.hydrate> | null = null;

    if (_artist) {
      artist = await Artist.findById(_artist);

      if (!artist) {
        return void res.status(404).send({ error: 'Artist not found' });
      }
    }

    const filter = !req.user
      ? { isPublished: true }
      : req.user.role !== 'admin'
      ? { $or: [{ isPublished: true }, { uploadedBy: req.user._id }] }
      : {};
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
            doc: {
              $unsetField: {
                field: 'tracks',
                input: '$$ROOT',
              },
            },
          },
          trackCount: { $count: {} },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', '$_id.doc'],
          },
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        $match: filter,
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

router.get('/:id', async (_req, res, next) => {
  const req = _req as RequestWithUser<{ id: string }>;
  const id = req.params.id;

  try {
    const filter = !req.user
      ? { isPublished: true }
      : req.user.role !== 'admin'
      ? { $or: [{ isPublished: true }, { uploadedBy: req.user._id }] }
      : {};
    const album = await Album.findById(id).find(filter).populate('artist');

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

router.patch('/:id/togglePublished', permit('admin'), async (_req, res, next) => {
  const req = _req as RequestWithUser<{ id: string }>;
  const id = req.params.id;

  try {
    const album = await Album.findById(id);

    if (!album) {
      return void res.status(404).send({ error: 'Album not found.' });
    }

    if (!req.user || req.user.role !== 'admin') {
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

router.delete('/:id', permit('user', 'admin'), async (_req, res, next) => {
  const req = _req as RequestWithUser<{ id: string }>;
  const id = req.params.id;

  try {
    const album = await Album.findById(id);

    if (!album) {
      return void res.status(404).send({ error: 'Album not found.' });
    }

    if (req.user?.role !== 'admin' && (album.isPublished || !req.user || !album.uploadedBy.equals(req.user._id))) {
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
