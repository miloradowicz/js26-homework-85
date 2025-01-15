import mongoose from 'mongoose';

import Artist from './Artist';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'value is required'] },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'value is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) =>
          !!(await Artist.findById(value)),
        message: 'value not found.',
      },
    },
    year: { type: Number, required: [true, 'value is required'] },
    coverUrl: String,
    __v: { type: Number, select: false },
  },
  {
    strict: 'throw',
  }
);

export default mongoose.model('Album', schema);
