import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { TUser } from '../User/user.interface';
import { User } from '../User/user.model';

const signUpIntoDB = async (payload: TUser) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  //create user
  const newUser = await User.create(payload);

  return newUser;
};

export const AuthServices = {
  signUpIntoDB,
};
