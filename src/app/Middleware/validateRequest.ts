import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

const validateRequest = (Schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await Schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export const validateRequestCookies = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedCookies = await schema.parseAsync({
      cookies: req.cookies,
    });

    req.cookies = parsedCookies.cookies;

    next();
  });
};
export default validateRequest;
