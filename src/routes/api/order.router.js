import {Router} from 'express';
import orderController from '../../app/controllers/api/order.controller.js';
import authMiddleware from '../../middlewares/auth-middleware.js';
import {roles} from '../../constants/credential.constant.js';

const router = Router();
router.post('/',authMiddleware([roles.CUSTOMER]),orderController.checkout);
router.post('/validation',authMiddleware(roles.CUSTOMER),orderController.validateConfirmCart);
router.get('/',authMiddleware([roles.CUSTOMER,roles.ADMIN]),orderController.get);
router.put('/',authMiddleware([roles.ADMIN]),orderController.approve);

export default router;