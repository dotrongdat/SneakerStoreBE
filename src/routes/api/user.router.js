import {Router} from 'express';
import UserController from '../../app/controllers/api/user.controller.js';
import authMiddleware from '../../middlewares/auth-middleware.js';
import {roles} from '../../constants/credential.constant.js';

const router = Router();

router.put('/cart/addition',authMiddleware([roles.CUSTOMER]),UserController.addToCart);
router.put('/cart',authMiddleware(roles.CUSTOMER),UserController.updateCart);
router.get('/cart',authMiddleware(roles.CUSTOMER),UserController.getCart);
router.get('/username',UserController.findByUsername);
router.get('/id',UserController.getById);

export default router;