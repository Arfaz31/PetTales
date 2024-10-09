import { Types } from 'mongoose';

export type TPost = {
  _id?: string;
  title: string;
  content: string;
  user: Types.ObjectId;
  images?: string[];
  category: 'Tip' | 'Story';
  contentType: 'basic' | 'premium';
  isPublished?: boolean;
  // upvotes: number;
  // downvotes: number;
};
