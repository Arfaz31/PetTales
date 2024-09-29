import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express(); //This initializes an Express application

app.use(express.json()); //Without this, Express would not automatically understand the body of POST/PUT requests when JSON is sent in the request body.

app.use(cors()); //It allows frontend applications from different domains to communicate with your server.

// app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// app.use(globalErrorHandler);
// app.use(notFoundRoute);

export default app;
