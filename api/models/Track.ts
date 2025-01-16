import mongoose from 'mongoose';

import Album from './Album';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'value is required'] },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      required: [true, 'value is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await Album.findById(value)),
        message: 'value not found.',
      },
    },
    trackNum: { type: Number, required: [true, 'value is required'] },
    length: String,
    __v: { type: Number, select: false },
  },
  {
    strict: 'throw',
  }
);

export default mongoose.model('Track', schema);
