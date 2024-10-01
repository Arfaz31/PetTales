import { Types } from 'mongoose';
import { USER_Role, USER_STATUS } from './user.constant';

export type TUser = {
  name: string;
  role: keyof typeof USER_Role;
  email: string;
  password: string;
  profilePhoto?: string;
  coverImg?: string;
  status: keyof typeof USER_STATUS;
  passwordChangedAt?: Date;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  mobileNumber?: string;
  about?: string;
  contactNo?: string;
  gender?: ['male', 'female', 'other'];
  address?: string;
  isDeleted?: boolean;
};
