import mongoose from 'mongoose';
import Track from './Track';
import User from './User';

const schema = new mongoose.Schema(
  {
    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: true,
      validate: {
        validator: async (value: mongoose.Types.ObjectId) =>
          !!(await Track.findById(value)),
        message: 'value not found.',
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
        validator: async (value: mongoose.Types.ObjectId) =>
          !!(await User.findById(value)),
        message: 'value not found.',
      },
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    __v: { type: Number, select: false },
  },
  {
    strict: 'throw',
    versionKey: false,
  }
);

export default mongoose.model('TrackHistory', schema);
