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

  // Extract the first name from the user's name (split by space and take the first part)
  // eslint-disable-next-line prefer-const
  let firstName = payload.name.trim().split(' ')[0].toLowerCase();

  // Generate a random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  // Start with the base username in the format @firstname + random number
  let username = `@${firstName}${randomNum}`; // Example: @john1234

  // Check if the generated username already exists in the database
  let usernameExists = await User.findOne({ username });

  // If the username exists, keep generating new random numbers until it's unique
  while (usernameExists) {
    const newRandomNum = Math.floor(1000 + Math.random() * 9000);
    username = `@${firstName}${newRandomNum}`; // Keep the @firstname format, just change the number
    usernameExists = await User.findOne({ username });
  }

  // Add the generated username to the payload
  payload.username = username;

  //create user
  const newUser = await User.create(payload);

  //create token and sent to the  client

  const jwtPayload = {
    _id: newUser._id,
    name: newUser.name,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
    profilePhoto: newUser.profilePhoto,
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

  return {
    accessToken,
    refreshToken,
  };
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
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    profilePhoto: user.profilePhoto,
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

  // const userData = {
  //   _id: user._id,
  //   name: user.name,
  //   email: user.email,
  //   Phone: user.mobileNumber,
  //   gender: user.gender,
  //   role: user.role,
  //   status: user.status,
  // };

  return {
    accessToken,
    refreshToken,
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
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    profilePhoto: user.profilePhoto,
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

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    profilePhoto: user.profilePhoto,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken} `;
  sendEmail(user.email, resetUILink);

  // console.log('user email:', user.email, 'reset link:', resetUILink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  console.log('payload:', payload);
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );

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
  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
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
