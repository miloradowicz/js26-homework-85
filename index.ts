import express from 'express';
import mongoose from 'mongoose';

import config from './config';
import artists from './routers/artists';
import albums from './routers/albums';
import tracks from './routers/tracks';
import users from './routers/users';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/artists', artists);
app.use('/albums', albums);
app.use('/tracks', tracks);
app.use('/users', users);

(async () => {
  await mongoose.connect(new URL(config.mongo.db, config.mongo.host).href);

  app.listen(config.express.port, () => {
    console.log(`Server ready on port http://localhost:${config.express.port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
})().catch(console.error);
