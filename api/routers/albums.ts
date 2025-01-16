import express, { NextFunction, Request, Response } from 'express';
import { Error, Types } from 'mongoose';

import { imageUpload } from '../multer';
import Artist from '../models/Artist';
import Album from '../models/Album';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const _artist = req.query.artist as string | undefined;

  try {
    if (_artist) {
      const artist = await Artist.findById(_artist);

      if (!artist) {
        return void res.status(404).send({ error: 'artist not found.' });
      }

      const albums = await Album.aggregate([
        {
          $match: { artist: new Types.ObjectId(_artist) },
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
          $replaceWith: {
            $setField: { field: 'title', input: '$$ROOT', value: '$_id.title' },
          },
        },
        {
          $replaceWith: {
            $setField: { field: 'year', input: '$$ROOT', value: '$_id.year' },
          },
        },
        {
          $replaceWith: {
            $setField: { field: 'coverUrl', input: '$$ROOT', value: '$_id.coverUrl' },
          },
        },
        {
          $replaceWith: {
            $setField: { field: '_id', input: '$$ROOT', value: '$_id._id' },
          },
        },
      ]).sort('year');

      return void res.send({ albums, artist });
    }

    const albums = await Album.find({});
    res.send({ albums });
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
