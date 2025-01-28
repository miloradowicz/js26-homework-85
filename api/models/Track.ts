import mongoose from 'mongoose';

import Album from './Album';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      required: [true, 'Album is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await Album.findById(value)),
        message: 'Album not found.',
      },
    },
    trackNum: { type: Number, required: [true, 'Track number is required'] },
    length: String,
    youTubeUrl: String,
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

export default mongoose.model('Track', schema);
