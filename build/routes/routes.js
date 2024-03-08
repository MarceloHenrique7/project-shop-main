"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/userController/UserController"));
const AuthMiddleware_1 = require("../shared/middleware/AuthMiddleware");
const router = (0, express_1.Router)();
router.get('/login', AuthMiddleware_1.checkUser, UserController_1.default.loginGet);
router.get('/signup', AuthMiddleware_1.checkUser, UserController_1.default.signupGet);
router.post('/login', UserController_1.default.loginPost);
router.post('/signup', UserController_1.default.signupPost);
router.put('/update', AuthMiddleware_1.checkUser, UserController_1.default.updateUser);
router.get('/logout', UserController_1.default.logoutGet);
exports.default = router;
