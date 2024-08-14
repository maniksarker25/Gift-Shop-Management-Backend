import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { giftRoutes } from '../modules/gift/gift.routes';
import { saleRoutes } from '../modules/sale/sale.routes';
import { couponRoutes } from '../modules/coupon/coupon.routes';
import { metaRoutes } from '../modules/meta/meta.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    router: authRoutes,
  },
  {
    path: '/gifts',
    router: giftRoutes,
  },
  {
    path: '/sales',
    router: saleRoutes,
  },
  {
    path: '/coupons',
    router: couponRoutes,
  },
  {
    path: '/meta',
    router: metaRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
