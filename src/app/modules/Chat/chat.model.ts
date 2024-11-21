import mongoose, { Schema } from 'mongoose';
import { IChat } from './chat.interface';

const ChatSchema = new Schema<IChat>(
  {
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
