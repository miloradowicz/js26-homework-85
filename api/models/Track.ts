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
        message: 'Album not found',
      },
    },
    trackNum: {
      type: Number,
      required: [true, 'Track number is required'],
      validate: [
        {
          validator: (value: number) => Number.isInteger(value) && value >= 1 && value <= 99,
          message: 'Track number must be an integer between 1 and 99',
        },
        {
          validator: async function (this: ReturnType<typeof Track.hydrate>, value: number) {
            return !(await Track.findOne({
              album: this.album,
              trackNum: value,
            }));
          },
          message: 'Track with the same track number already exists in the album',
        },
      ],
    },
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
  },
);

schema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Track = mongoose.model('Track', schema);

export default Track;
