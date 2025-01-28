import mongoose from 'mongoose';

import Artist from './Artist';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'Artist is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await Artist.findById(value)),
        message: 'Artist not found.',
      },
    },
    year: { type: Number, required: [true, 'Year is required'] },
    coverUrl: String,
    __v: { type: Number, select: false },
  },
  {
    strict: 'throw',
  }
);

schema.set('toJSON', {
  transform: (_doc, ret, _options) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Album', schema);
