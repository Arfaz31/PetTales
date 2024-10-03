/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from '../../Error/AppError';
import { USER_Role, USER_STATUS } from '../User/user.constant';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    _id?: string;
    email: string;
    role: keyof typeof USER_Role;
    status: keyof typeof USER_STATUS;
  },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    throw new AppError(401, 'You are not authorized!');
  }
};
