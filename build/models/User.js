"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = require("validator");
const userSchema = new mongoose_1.default.Schema({
    user_name: {
        type: String,
        required: [true, "please enter a username"],
        unique: true,
        lowercase: true,
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
        minlength: [6, "Minimum password length is 6 character"] // o usuario digitou menos que 6 caracteres? retorne essa mensagem 
    },
    isAdmin: {
        type: Boolean,
        required: false
    }
});
const User = mongoose_1.default.model('user', userSchema);
exports.default = User;
