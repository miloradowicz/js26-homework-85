import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photoUrl: String,
    description: String,
  },
  {
    strict: 'throw',
    versionKey: false,
  }
);

export default mongoose.model('Artist', schema);
