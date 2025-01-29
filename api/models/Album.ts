import mongoose from 'mongoose';

import Artist from './Artist';
import User from './User';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'Artist is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await Artist.findById(value)),
        message: 'Artist not found',
      },
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      validate: {
        validator: (value: number) => Number.isInteger(value) && value >= 1900 && value <= 2032,
        message: 'Year must be an integer between 1900 and 2032',
      },
    },
    coverUrl: String,
    isPublished: {
      type: Boolean,
      required: [true, 'IsPublished is required'],
      default: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UploadedBy is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await User.findById(value)),
        message: 'User not found',
      },
    },
    __v: { type: Number, select: false },
  },
  {
    strict: 'throw',
  }
);

schema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Album', schema);
