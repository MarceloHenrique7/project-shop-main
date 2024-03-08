"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("../../database/models/User"));
const http_status_codes_1 = require("http-status-codes");
const signupValidationError_1 = require("../../shared/middleware/signupValidationError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY_SIGN = process.env.SECRET_KEY_SIGN;
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, `${SECRET_KEY_SIGN}`, {
        expiresIn: maxAge,
    });
};
const authLogin = (user_name, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ user_name: user_name });
    if (user) {
        const auth = yield bcrypt_1.default.compare(password, user.password);
        if (auth) {
            return user;
        }
        else {
            const message = "Invalid password";
            throw new mongoose_1.Error.ValidatorError({ message });
        }
    }
    const message = "Invalid user";
    throw new mongoose_1.Error.ValidatorError({ message });
});
class UserController {
    loginGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render('login');
        });
    }
    loginPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_name, password } = req.body;
            try {
                const user = yield authLogin(user_name, password);
                const token = createToken(user.id); // Convertendo para string porque a minha função não estava reconhecendo o id como str
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(http_status_codes_1.StatusCodes.OK).json({ auth: "success", user: user._id });
            }
            catch (error) {
                const errors = (0, signupValidationError_1.errorsHandle)(error);
                console.log(errors);
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(errors);
            }
        });
    }
    signupGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render('signup');
        });
    }
    signupPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_name, email, password } = req.body;
            try {
                const user = yield User_1.default.create({ user_name, email, password });
                const token = createToken(user.id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    user: user._id,
                    msg: 'User Created with success!',
                });
            }
            catch (error) {
                const errors = (0, signupValidationError_1.errorsHandle)(error);
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_name, email, password } = req.body;
            const token = req.cookies.jwt;
            let id = '';
            const decoded = jwt.decode(token);
            if (decoded !== null && typeof decoded === 'object') {
                id = decoded.id;
            }
            console.log(id);
            try {
                const user = yield User_1.default.updateOne({ _id: id }, { $set: { user_name: user_name } }, {}).then(() => {
                    console.log("User updated with success");
                }).catch((err) => {
                    console.log(err);
                });
                res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({ msg: "User updated with success", user });
            }
            catch (error) {
                const errors = (0, signupValidationError_1.errorsHandle)(error);
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
            }
        });
    }
    logoutGet(req, res) {
        res.cookie('jwt', '', { maxAge: 1 });
        res.redirect('/');
    }
}
const UserControll = new UserController();
exports.default = UserControll;
