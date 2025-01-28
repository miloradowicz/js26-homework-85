import express, { NextFunction, Request, Response } from 'express';
import { Error, Document, Types, HydratedDocument } from 'mongoose';

import { imageUpload } from '../middleware/multer';
import Artist from '../models/Artist';
import Album from '../models/Album';

const router = express.Router();

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

    if (album) {
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
      return void res.status(400).send(e);
    }
    next(e);
  }
});

export default router;
