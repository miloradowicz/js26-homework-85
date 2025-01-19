import mongoose, { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import config from '../config';

export interface Fields {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  token: string;
}

interface Methods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type Model = mongoose.Model<Fields, {}, Methods>;

const schema = new mongoose.Schema<HydratedDocument<Fields>, Model, Methods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<Fields>, value: string): Promise<boolean> {
          return !this.isModified('username') || !(await User.findOne({ username: value }));
        },
        message: 'username already taken',
      },
    },
    password: { type: String, required: true },
    token: { type: String, required: true },
  },
  {
    strict: 'throw',
    versionKey: false,
  }
);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(config.saltWorkFactor);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
});

schema.set('toJSON', {
  transform: (_doc, ret, _options) => {
    delete ret.password;
    return ret;
  },
});

schema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

schema.methods.generateToken = function () {
  this.token = randomUUID();
};

const User = mongoose.model<HydratedDocument<Fields>, Model>('User', schema);

export default User;
