/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/Middleware/globalErrorHandler';
import notFoundRoute from './app/Middleware/noRouteFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import path from 'path';

const app: Application = express(); //This initializes an Express application

//parser
app.use(express.json()); //Without this, Express would not automatically understand the body of POST/PUT requests when JSON is sent in the request body.
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://pettales.vercel.app/',
    credentials: true,
  }),
); //It allows frontend applications from different domains to communicate with your server.

app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to PetTales');
});

app.use(
  globalErrorHandler as (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void,
);
app.use('*', notFoundRoute);

export default app;
