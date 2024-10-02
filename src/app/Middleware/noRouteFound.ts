import { Request, Response } from 'express';
import httpStatus from 'http-status';

const notFoundRoute = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: 404,
    message: 'Api is not found',
  });
  res.end(); // Add this line to indicate the response is complete
};

export default notFoundRoute;
