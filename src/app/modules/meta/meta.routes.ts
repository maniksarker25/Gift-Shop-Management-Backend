import express from 'express';
import { metaControllers } from './meta.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();
router.get(
  '/',
  auth(USER_ROLE.manager, USER_ROLE.seller),
  metaControllers.getDashboardMetaData,
);
router.get(
  '/line-chart-manager',
  auth(USER_ROLE.manager),
  metaControllers.getManagerLineChartData,
);

export const metaRoutes = router;
