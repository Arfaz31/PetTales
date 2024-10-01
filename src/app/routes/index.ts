import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

// Use the main `router.use` to register each route
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
