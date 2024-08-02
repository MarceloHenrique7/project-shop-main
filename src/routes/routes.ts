import { Router } from "express";
import {userController} from "../controllers/Index";
import {requireAuth } from "../shared/middleware/AuthMiddleware";
const router = Router();




router.get('/login', requireAuth, userController.loginGet)
router.get('/signup', requireAuth, userController.signupGet)
router.get('/update', requireAuth, userController.updateGet)
router.get('/update', requireAuth, userController.updateGet)
router.get('/logout', userController.logoutGet)


router.post('/login', userController.loginPost)
router.post('/signup', userController.validationSingUp, userController.signupPost)
router.put('/update', userController.validationUpdate, userController.updateUser)

export default router;