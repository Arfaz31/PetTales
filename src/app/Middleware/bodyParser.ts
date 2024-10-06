import AppError from '../Error/AppError';
import catchAsync from '../utils/catchAsync';

export const parseBody = catchAsync(async (req, res, next) => {
  // If req.body.data exists, parse it as JSON
  if (req.body?.data) {
    req.body = JSON.parse(req.body.data);
  }
  // If there is no data, allow proceeding if files are present
  if (!Object.keys(req.body).length && !req.files) {
    throw new AppError(400, 'Please provide data or files to update');
  }

  next();
});
