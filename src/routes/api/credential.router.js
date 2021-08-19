import {Router} from 'express';
import CredentialController from '../../app/controllers/api/credential.controller.js';
import authMiddleware from '../../middlewares/auth-middleware.js';
//import multer from 'multer';

const router = Router();

router.post('/signin',CredentialController.signIn);
router.post('/signout',CredentialController.signOut);
router.post('/signup',CredentialController.signUp);
router.post('/signinToken',authMiddleware(),CredentialController.signInToken);

export default router;