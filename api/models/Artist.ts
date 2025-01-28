import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required.'] },
    photoUrl: String,
    description: String,
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
