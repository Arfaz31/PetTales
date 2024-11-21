import { Types } from 'mongoose';

export interface IChat {
  members: Types.ObjectId[]; // Array of user IDs
  createdAt?: Date;
  updatedAt?: Date;
}
