import { Types } from 'mongoose';

export type TComment = {
  _id?: string;
  post: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  // replies?: Types.ObjectId[];
};
