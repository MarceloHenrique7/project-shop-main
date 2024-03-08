import { Router } from "express";
import UserControll from "../controllers/userController/UserController";
import { checkUser } from "../shared/middleware/AuthMiddleware";
const router = Router();


router.get('/login', checkUser, UserControll.loginGet)
router.get('/signup', checkUser, UserControll.signupGet)
router.post('/login', UserControll.loginPost)
router.post('/signup', UserControll.signupPost)
router.put('/update', checkUser, UserControll.updateUser)
router.get('/logout', UserControll.logoutGet)

export default router;