import { Types } from 'mongoose';

export type TFollow = {
  follower: Types.ObjectId; // The user who follows
  following: Types.ObjectId; // The user being followed
};
