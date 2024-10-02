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
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'], // Matches the tuple type in TUser
      required: true,
    },
    role: {
      type: String,
      enum: Object.keys(USER_Role), // Maps enum keys to strings
      default: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: Object.keys(USER_STATUS), // Maps enum keys to strings
      default: 'basic',
      required: true,
    },
    address: {
      type: String,
    },
    followers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [], // Set default to an empty array (0 followers)
    },
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [], // Set default to an empty array (0 following)
    },
    profilePhoto: {
      type: String,
    },
    coverImg: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    about: {
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

//pasword compared by bcrypt
export const isPasswordMatched = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatched = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatched;
};

export const User = model<TUser>('User', userSchema);
