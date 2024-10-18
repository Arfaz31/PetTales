import { USER_Role, USER_STATUS } from './user.constant';
import { Model } from 'mongoose';

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  role: keyof typeof USER_Role;
  status: keyof typeof USER_STATUS;
  address?: string;
  profilePhoto?: string;
  coverImg?: string;
  passwordChangedAt?: Date;
  about?: string;
  isDeleted?: boolean;
};

export interface UserModel extends Model<TUser> {
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
