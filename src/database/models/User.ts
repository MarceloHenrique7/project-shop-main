import mongoose, { HydratedDocument } from "mongoose";
import { Model } from "mongoose";
import { isEmail } from 'validator';
import bcrypt from 'bcrypt'

type IUser = {
    user_name: string;
    email: string;
    password: string;
}
  

const userSchema = new mongoose.Schema<IUser>({ // criando um user schema
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
        validate: [isEmail, "Please enter a valid email"] // usando função do validator para verificar se esse campo e um email, se nao for. retorne essa mensagem 
    },

    password: {
        type: String,
        required: [true, "please enter a password"], // e obrigatorio esse valor? 'caso user nao insira retorne essa mensagem 
        minlength: [6, "Minimum password length is 6 character"], // o usuario digitou menos que 6 caracteres? retorne essa mensagem 
        maxlength: [100, "Maximum password length is 20 character"] // o usuario digitou menos que 6 caracteres? retorne essa mensagem 
    },

})

userSchema.post('save', function (doc, next) {
    console.log("new user was created & saved", doc)
    next()
})




const User = mongoose.model<IUser>('user', userSchema)


export default User;