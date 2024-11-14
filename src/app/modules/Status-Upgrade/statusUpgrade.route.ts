import { Router } from 'express';
import auth from '../../Middleware/auth';
import { USER_Role } from '../User/user.constant';
import validateRequest from '../../Middleware/validateRequest';
import { createStatusUpgradeValidationSchema } from './statusUpgrade.validation';
import { StatusUpgradeController } from './statusUpgrade.controller';

const router = Router();

router.post(
  '/',
  auth(USER_Role.admin, USER_Role.user),
  validateRequest(createStatusUpgradeValidationSchema),
  StatusUpgradeController.userStatusUpgrade,
);

router.get(
  '/allVerifiedUsers',
  auth(USER_Role.admin),
  StatusUpgradeController.getAllStatusUpgradeUsers,
);
router.get(
  '/totalIncomeOfWebsite',
  auth(USER_Role.admin),
  StatusUpgradeController.getTotalWebsiteIncome,
);

export const StatusUpgradeRoutes = router;
