import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { USER_Role, USER_STATUS } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
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

    profilePhoto: {
      type: String,
      default: null,
    },
    coverImg: {
      type: String,
      default: null,
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
  const user = this;

  // Only hash the password if it has been modified (i.e., during password changes). With this update, when you change fields like status or any other non-password-related fields, the password will remain unchanged in the database.
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_round),
    );
  }

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

//check if password changed after the token was issued. if that then the previous jwt token will be invalid
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000; //at first getTime () method converts the UTC time in seconds then it convert in miliseconds / 1000
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
