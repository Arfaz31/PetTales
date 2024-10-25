import { USER_Role, USER_STATUS } from './user.constant';
import { Model, Types } from 'mongoose';

export type TUser = {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  mobileNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  role: keyof typeof USER_Role;
  status: keyof typeof USER_STATUS;
  follower: Types.ObjectId[];
  following: Types.ObjectId[];
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
