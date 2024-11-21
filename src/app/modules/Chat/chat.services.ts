import Chat from './chat.model';

// export const createChat = async (payload: IChat) => {
//   const chat = await Chat.create(payload);
//   return chat;
// };

export const userChats = async (userId: string) => {
  return await Chat.find({ members: { $in: [userId] } }).populate(
    'members',
    '_id name username profilePhoto',
  );
};

export const findChat = async (user1: string, user2: string) => {
  return await Chat.findOne({ members: { $all: [user1, user2] } });
};

export const ChatServices = {
  userChats,
  findChat,
};
