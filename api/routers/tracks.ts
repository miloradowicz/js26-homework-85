import express from 'express';
import { Error } from 'mongoose';

import { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import Artist from '../models/Artist';
import Album from '../models/Album';
import Track from '../models/Track';

const router = express.Router();

router.post('/', permit('user', 'admin'), async (_req, res, next) => {
  const req = _req as RequestWithUser;

  try {
    const track = await Track.create({
      title: req.body.title ?? null,
      album: req.body.album ?? null,
      trackNum: req.body.trackNum ?? null,
      length: req.body.length ?? null,
      uploadedBy: req.user?._id ?? null,
    });

    res.send(track);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return void res.status(400).send(e);
    }

    next(e);
  }
});

router.get('/', async (_req, res, next) => {
  const req = _req as RequestWithUser;
  const _artist = req.query.artist as string | undefined;
  const _album = req.query.album as string | undefined;

  let artist: ReturnType<typeof Artist.hydrate> | null = null;
  let album: ReturnType<typeof Album.hydrate> | null = null;

  try {
    if (_artist) {
      artist = await Artist.findById(_artist);

      if (!artist) {
        return void res.status(404).send({ error: 'Artist not found.' });
      }
    }

    if (_album) {
      album = await Album.findById(_album);

      if (!album) {
        return void res.status(404).send({ error: 'Album not found.' });
      }

      const _artist = await Artist.findById(album.artist);

      if (!_artist) {
        return void res.status(404).send({ error: 'Album artist not found.' });
      }

      if (!artist) {
        artist = _artist;
      } else if (!artist._id.equals(_artist._id)) {
        return void res.status(404).send({ error: 'Album does not belong to artist' });
      }
    }

    const filter = !req.user
      ? { isPublished: true }
      : req.user.role !== 'admin'
      ? { $or: [{ isPublished: true }, { uploadedBy: req.user._id }] }
      : {};
    const tracks = await Album.aggregate([
      {
        $match: {
          $and: [artist ? { artist: artist._id } : {}, album ? { _id: album._id } : {}],
        },
      },
      {
        $group: {
          _id: 0,
          doc: { $push: '$$ROOT' },
        },
      },
      {
        $unwind: {
          path: '$doc',
          includeArrayIndex: 'order',
        },
      },
      {
        $lookup: {
          from: 'tracks',
          localField: 'doc._id',
          foreignField: 'album',
          as: 'tracks',
        },
      },
      {
        $unwind: {
          path: '$tracks',
        },
      },
      {
        $sort: { 'order': 1, 'tracks.trackNum': 1 },
      },
      {
        $replaceRoot: {
          newRoot: '$tracks',
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
    ]);

    return void res.send(album ? { tracks, album, artist } : artist ? { tracks, artist } : { tracks });
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
    const track = await Track.findById(id);

    if (!track) {
      return void res.status(404).send({ error: 'Track not found.' });
    }

    if (!req.user || req.user.role !== 'admin') {
      return void res.status(403).send({ error: 'Unauthorized' });
    }

    track.isPublished = !track.isPublished;
    await track.save({ validateModifiedOnly: true });
    res.send(track);
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
    const track = await Track.findById(id);

    if (!track) {
      return void res.status(404).send({ error: 'Track not found.' });
    }

    if (req.user?.role !== 'admin' && (track.isPublished || !req.user || !track.uploadedBy.equals(req.user._id))) {
      return void res.status(403).send({ error: 'Unauthorized' });
    }

    await track.deleteOne();
    res.send(null);
  } catch (e) {
    if (e instanceof Error.CastError) {
      return void res.status(400).send({ error: 'Invalid id' });
    }

    next(e);
  }
});

export default router;
