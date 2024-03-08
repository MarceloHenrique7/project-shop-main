import { Router } from "express";
import {userController} from "../controllers/Index";
import { checkUser } from "../shared/middleware/AuthMiddleware";
const router = Router();

router.get('/login', checkUser, userController.loginGet)
router.get('/signup', checkUser, userController.signupGet)
router.get('/update', checkUser, userController.updateGet)
router.get('/logout', userController.logoutGet)


router.post('/login', userController.loginPost)
router.post('/signup', userController.signupPost)
router.put('/update', checkUser, userController.updateUser)

export default router;