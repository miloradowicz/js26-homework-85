import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'value is required.'] },
    photoUrl: String,
    description: String,
    __v: { type: Number, select: false },
  },
  {
    strict: 'throw',
  }
);

export default mongoose.model('Artist', schema);
