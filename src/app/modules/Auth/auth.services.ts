import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { TUser } from '../User/user.interface';
import { isPasswordMatched, User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utils/sendEmail';
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
  //+password means give other fields with password
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

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.findOne({ _id: userData._id }).select('+password');
  //+password means give other fields with password
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }

  //check if the password is correct
  const passwordMatch = await isPasswordMatched(
    payload.oldPassword, //plain text password
    user.password, //hash password
  );
  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { _id, iat } = decoded;

  const user = await User.findOne({ _id }).select('+password');

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

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

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;
  sendEmail(user.email, resetUILink);

  console.log('user email:', user.email, 'reset link:', resetUILink);
};

const resetPassword = async (
  payload: { _id: string; newPassword: string },
  token: string,
) => {
  const user = await User.findById(payload?._id).select('+password');

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }

  // checking if the given token is valid
  const decoded = verifyToken(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //check if the id is valid by comparing it with the id in the token
  if (payload._id !== decoded._id) {
    console.log(payload._id, decoded._id);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      _id: decoded._id,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  signUpIntoDB,
  logInUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
