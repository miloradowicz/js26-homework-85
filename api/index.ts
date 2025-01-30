import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';
import auth from './middleware/auth';
import users from './routers/users';
import artists from './routers/artists';
import albums from './routers/albums';
import tracks from './routers/tracks';
import trackHistory from './routers/trackHistory';
import admin from './routers/admin';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(auth);

app.use('/artists', artists);
app.use('/albums', albums);
app.use('/tracks', tracks);
app.use('/users', users);
app.use('/track_history', trackHistory);
app.use('/admin', admin);

(async () => {
  await mongoose.connect(new URL(config.mongo.db, config.mongo.host).href);

  app.listen(config.express.port, () => {
    console.log(`Server ready on port http://localhost:${config.express.port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
})().catch(console.error);
