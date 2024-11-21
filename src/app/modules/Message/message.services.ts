import Message from './message.model';
import { IMessage } from './message.interface';
import mongoose from 'mongoose';
import Chat from '../Chat/chat.model';

export const addMessage = async (payload: IMessage) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Destructure payload
    const { senderId, chatId, text, receiverId } = payload;

    // Find or create chat
    let chat = chatId ? await Chat.findById(chatId).session(session) : null;

    if (!chat) {
      chat = new Chat({ members: [senderId, receiverId] });
      await chat.save({ session });

      if (!chat) {
        throw new Error('Chat creation failed');
      }
    }

    // Add the message
    const message = new Message({ chatId: chat._id, senderId, text });
    await message.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { chat, message };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getMessages = async (chatId: string) => {
  return await Message.find({ chatId }).populate(
    'senderId',
    '_id name profilePhoto',
  );
};

export const MessageServices = {
  addMessage,
  getMessages,
};
