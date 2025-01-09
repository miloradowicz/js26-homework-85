import express from 'express';

import { imageUpload } from '../multer';
import User from '../models/User';
import TrackHistory from '../models/TrackHistory';

const router = express.Router();

router.post('/', imageUpload.single('photo'), async (req, res, next) => {
  const token = req.get('Authorization');
  const track: string | null = req.body.track ?? null;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return void res.status(401).send({ error: 'Invalid token.' });
    }

    const trackHistory = await TrackHistory.create({ track, user: user._id });
    res.send(trackHistory);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

export default router;
