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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = require("validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    user_name: {
        type: String,
        required: [true, "please enter a username"],
        unique: true,
        lowercase: true,
        minlength: [6, "Minimum username length is 6 character"], // o usuario digitou menos que 6 caracteres? retorne essa mensagem 
        maxlength: [25, "Maximum username length is 20 character"]
    },
    email: {
        type: String,
        required: [true, "please enter a email"], // e obrigatorio esse valor? 'caso user nao insira retorne essa mensagem 
        unique: true,
        lowercase: true,
        validate: [validator_1.isEmail, "Please enter a valid email"] // usando função do validator para verificar se esse campo e um email, se nao for. retorne essa mensagem 
    },
    password: {
        type: String,
        required: [true, "please enter a password"], // e obrigatorio esse valor? 'caso user nao insira retorne essa mensagem 
        minlength: [6, "Minimum password length is 6 character"], // o usuario digitou menos que 6 caracteres? retorne essa mensagem 
        maxlength: [20, "Maximum password length is 20 character"] // o usuario digitou menos que 6 caracteres? retorne essa mensagem 
    },
});
userSchema.post('save', function (doc, next) {
    console.log("new user was created & saved", doc);
    next();
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt();
        this.password = yield bcrypt_1.default.hash(this.password, salt);
        next();
    });
});
const User = mongoose_1.default.model('user', userSchema);
exports.default = User;
