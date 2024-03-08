"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandle = void 0;
const mongoose_1 = require("mongoose");
const errorsHandle = (err) => {
    let errors = { user_name: '', email: '', password: '' };
    if (err.code === 11000) {
        const error = Object.values(err).map((err) => err);
        if (error[3].hasOwnProperty('user_name')) {
            errors.user_name = 'User name already exists';
        }
        else if (error[3].hasOwnProperty('email')) {
            errors.email = 'E-mail already exists';
        }
    }
    if (err instanceof mongoose_1.Error.ValidationError || err instanceof mongoose_1.Error.ValidatorError) {
        let message;
        if (err instanceof mongoose_1.Error.ValidationError) {
            message = Object.values(err.errors).map(err => err).toString().toLocaleLowerCase();
        }
        if (err instanceof mongoose_1.Error.ValidatorError) {
            message = Object.values(err.message).join('').toLocaleLowerCase();
        }
        console.log(message);
        if (message.includes('invalid user')) {
            errors.user_name = 'Invalid User';
        }
        if (message.includes('invalid password')) {
            errors.password = 'Invalid Password';
        }
        if (message.includes('please enter a username')) {
            errors.user_name = 'please enter a username';
        }
        if (message.includes('minimum username length is 6 character')) {
            errors.user_name = 'Minimum username length is 6 character';
        }
        if (message.includes('maximum username length is 20 character')) {
            errors.user_name = 'Maximum username length is 20 character';
        }
        if (message.includes('please enter a valid email')) {
            errors.email = 'Please enter a valid email';
        }
        if (message.includes('please enter a email')) {
            errors.email = 'please enter a email';
        }
        if (message.includes('please enter a password')) {
            errors.password = 'please enter a password';
        }
        if (message.includes('minimum password length is 6 character')) {
            errors.password = 'Minimum password length is 6 character';
        }
        if (message.includes('maximum password length is 20 character')) {
            errors.password = 'Maximum password length is 20 character';
        }
    }
    return errors;
};
exports.errorsHandle = errorsHandle;
