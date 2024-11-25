/* eslint-disable @typescript-eslint/no-explicit-any */
import Chat from './chat.model';

// export const createChat = async (payload: IChat) => {
//   const chat = await Chat.create(payload);
//   return chat;
// };

export const userChats = async (userId: string) => {
  // Find all chats where the user is a member
  const chats = await Chat.find({ members: { $in: [userId] } })
    .populate('members', '_id name username profilePhoto')
    .sort({ updatedAt: -1 });

  // Map over chats to include chatId and other member details
  const chatDetails = chats.map((chat) => {
    const otherMember = chat.members.find(
      (member: any) => member._id.toString() !== userId,
    );

    return {
      chatId: chat._id, // Include the chat's _id
      otherMember, // Include details of the other member
    };
  });

  return chatDetails;
};

export const findChat = async (userId1: string, userId2: string) => {
  // console.log(userId1, userId2);
  // Find the chat between the two users
  const chat = await Chat.findOne({
    members: { $all: [userId1, userId2] },
  }).populate({
    path: 'members',
    select: '_id name username profilePhoto',
  });

  if (!chat) return null;

  // Extract the other members (excluding userId1)
  // const otherMembers = chat.members.filter(
  //   (member: any) => member._id.toString() !== userId1,
  // );

  return chat;
};

export const ChatServices = {
  userChats,
  findChat,
};
