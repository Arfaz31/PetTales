import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';
import { socketServer } from './socketIoServer';
let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    // Start the Express server and get the server instance
    server = app.listen(config.port, () => {
      console.log('MongoDB connected successfully');
      console.log(`App is listening on port ${config.port}`);
    });

    // Pass the server instance to initialize Socket.IO
    socketServer(server);
  } catch (err) {
    console.log(err);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection detected, shutting down...', err);
  if (server) {
    server.close(() => {
      process.exit(1); //It terminates the Node.js process immediately, without completing any remaining asynchronous tasks.
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', () => {
  console.log('Uncaught exception detected, shutting down...');
  process.exit(1);
});

main();
