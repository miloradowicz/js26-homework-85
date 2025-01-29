import mongoose from 'mongoose';

import User from './User';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required.'] },
    photoUrl: String,
    description: String,
    isPublished: {
      type: Boolean,
      required: [true, 'IsPublished is required'],
      default: false,
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'PublishedBy is required'],
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
  transform: (_doc, ret, _options) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Artist', schema);
