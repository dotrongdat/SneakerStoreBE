import {Router} from 'express';
import CategoryController from '../../app/controllers/api/category.controller.js';
import multer from 'multer';
import {fileFilter} from '../../app/validations/image.validation.js';
import authMiddleware from '../../middlewares/auth-middleware.js';
import {roles} from '../../constants/credential.constant.js';
const router=Router();
const upload=multer(fileFilter);

router.post('/',[upload.single('logoFile'),authMiddleware(roles.ADMIN)],CategoryController.create);
router.get('/',CategoryController.getAll);

export default router;