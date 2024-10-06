import { Schema, model } from 'mongoose';
import { TComment } from './comment.inteface';

const commentSchema = new Schema<TComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // replies: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Comment',
    //   },
    // ],
  },
  {
    timestamps: true,
  },
);

const Comment = model<TComment>('Comment', commentSchema);
export default Comment;
