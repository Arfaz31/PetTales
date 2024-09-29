import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../Interface/errorType';

//Object.values() allows you to ignore the field names (name, age) directly giving you an array of error objects [{meassge:'', path:''}]
const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorMessages: TErrorSource = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages,
  };
};

export default handleValidationError;
