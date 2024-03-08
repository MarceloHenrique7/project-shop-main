"use strict";
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
exports.checkUser = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../database/models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY_SIGN}`, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
                console.log(err);
            }
            else {
                next();
            }
        });
    }
    else {
        res.redirect('/login');
    }
};
exports.requireAuth = requireAuth;
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY_SIGN}`, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                res.locals.user = null;
                next();
            }
            else {
                let user = yield User_1.default.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        }));
    }
    else {
        res.locals.user = null; // se o token nao existe significa que o user n esta logado, então define como null
        next();
    }
};
exports.checkUser = checkUser;
