import mongoose from 'mongoose';
import Track from './Track';
import User from './User';

const schema = new mongoose.Schema(
  {
    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: [true, 'Track is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await Track.findById(value)),
        message: 'Track not found.',
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await User.findById(value)),
        message: 'User not found.',
      },
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
  },
  {
    strict: 'throw',
    versionKey: false,
  },
);

export default mongoose.model('TrackHistory', schema);
