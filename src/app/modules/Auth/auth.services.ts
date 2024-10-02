import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { TUser } from '../User/user.interface';
import { isPasswordMatched, User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';
import config from '../../config';

const signUpIntoDB = async (payload: TUser) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You have already have an account',
    );
  }
  //create user
  const newUser = await User.create(payload);

  return newUser;
};

const logInUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }

  //check if the password is correct
  const passwordMatch = await isPasswordMatched(
    payload.password, //plain text password
    user.password, //hash password
  );
  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  //create token and sent to the  client

  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expire_in as string,
  );

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    Phone: user.mobileNumber,
    gender: user.gender,
    role: user.role,
    status: user.status,
  };

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

export const AuthServices = {
  signUpIntoDB,
  logInUser,
};
