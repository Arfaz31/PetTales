import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../Interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorMessages: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid Id',
    errorMessages,
  };
};

export default handleCastError;
