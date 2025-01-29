import mongoose from 'mongoose';

import Album from './Album';
import User from './User';

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

export default mongoose.model('Track', schema);
