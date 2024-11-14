import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusUpgradeServices } from './statusUpgrade.services';

const userStatusUpgrade = catchAsync(async (req, res) => {
  // console.log('Received request body:', req.body);
  const { _id, status } = req.user;
  const result = await StatusUpgradeServices.PayForStatusUpgrade(
    _id,
    status,
    req.body,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Staus Upgradation created successfully',
    data: result,
  });
});

const getAllStatusUpgradeUsers = catchAsync(async (req, res) => {
  const result = await StatusUpgradeServices.getAllStausUpgradeUsers();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'All upgraded users retrieved successfully',
    data: result,
  });
});

const getTotalWebsiteIncome = catchAsync(async (req, res) => {
  const result = await StatusUpgradeServices.getTotalIncomeOfWebsite();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Total income retrieved successfully',
    data: result,
  });
});

export const StatusUpgradeController = {
  userStatusUpgrade,
  getAllStatusUpgradeUsers,
  getTotalWebsiteIncome,
};
