import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import { USER_Role, USER_STATUS } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';
const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.keys(USER_Role),
      default: 'user',
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.keys(USER_STATUS),
      default: 'basic',
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    mobileNumber: {
      type: String,
    },
    about: {
      type: String,
    },
    contactNo: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: {
      type: String,
    },
    coverImg: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

//password field won't be shown in json response
userSchema.methods.toJSON = function () {
  const user = this.toObject(); //convert monogoDB document to plain js object
  delete user.password;
  return user;
};

//password hash by bcrypt
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; //'this' refers to the document that is being saved.
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

export const User = model<TUser>('User', userSchema);
