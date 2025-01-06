import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: mongoose.Types.ObjectId, required: true, ref: 'Artist' },
    year: { type: Number, required: true },
    coverUrl: String,
  },
  {
    strict: 'throw',
    versionKey: false,
  }
);

export default mongoose.model('Album', schema);
