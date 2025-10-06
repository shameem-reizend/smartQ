import express from 'express';
import { fetchAllUsers } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/User.entity';

const adminRoutes = express.Router();

adminRoutes.get("/users", authenticate, authorize(UserRole.ADMIN, UserRole.SERVICE_PROVIDER), fetchAllUsers);

export default adminRoutes;