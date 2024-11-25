import Message from './message.model';
import { IMessage } from './message.interface';
import mongoose from 'mongoose';
import Chat from '../Chat/chat.model';

export const addMessage = async (payload: IMessage) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Destructure payload
    const { senderId, receiverId, text, chatId } = payload;

    let chat;

    // If chatId is provided, find the chat directly
    if (chatId) {
      chat = await Chat.findById(chatId).session(session);
    }

    // If chatId is not provided or chat doesn't exist, search by members
    if (!chat) {
      chat = await Chat.findOne({
        members: { $all: [senderId, receiverId] }, // Match chats with both users
      }).session(session);
    }

    // If no existing chat is found, create a new one
    if (!chat) {
      chat = new Chat({ members: [senderId, receiverId] });
      await chat.save({ session });

      if (!chat) {
        throw new Error('Chat creation failed');
      }
    }

    // Add the message to the chat
    const message = new Message({
      chatId: chat._id,
      senderId,
      text,
    });

    await message.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { chat, message };
  } catch (error) {
    // Rollback the transaction in case of errors
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
