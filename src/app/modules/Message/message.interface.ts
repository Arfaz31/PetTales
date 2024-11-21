import { Types } from 'mongoose';

export interface IMessage {
  chatId?: Types.ObjectId; // Chat this message belongs to
  senderId: Types.ObjectId; // Who sent the message
  receiverId?: Types.ObjectId;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}
