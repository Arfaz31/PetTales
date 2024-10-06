import { Types } from 'mongoose';

export type TLike = {
  _id?: string;
  user: Types.ObjectId;
  post: Types.ObjectId;
  isUpvote: boolean;
};
