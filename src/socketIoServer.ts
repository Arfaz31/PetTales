import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let activeUsers: Array<{ userId: string; socketId: string }> = [];

export const socketServer = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'https://pettales.vercel.app',
    },
  });

  io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    // Add new user
    socket.on('new-user-add', (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log('New User Connected', activeUsers);
      }
      io.emit('get-users', activeUsers);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log('User Disconnected', activeUsers);
      io.emit('get-users', activeUsers);
    });

    // Send message to a specific user
    socket.on('send-message', (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      console.log('Sending from socket to:', receiverId);
      console.log('Data:', data);
      if (user) {
        io.to(user.socketId).emit('recieve-message', data);
      }
    });
  });
};
