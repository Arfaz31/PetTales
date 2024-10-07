import { Schema, model } from 'mongoose';
import { TLike } from './like.interface';

const likeSchema = new Schema<TLike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Like = model<TLike>('Like', likeSchema);
export default Like;
