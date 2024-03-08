import { Request, Response } from "express";
import { Error } from "mongoose";
import User from "../../database/models/User";
import { StatusCodes } from "http-status-codes";
import { errorsHandle } from "../../shared/middleware/signupValidationError";
import bcrypt from 'bcrypt'
import * as jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY_SIGN = process.env.SECRET_KEY_SIGN
const maxAge = 3 * 24 * 60 * 60

const createToken = (id: string) => {
    return jwt.sign({id}, `${SECRET_KEY_SIGN}`, {
        expiresIn: maxAge,
    })
}


const authLogin = async (user_name: string, password: string) => {
    const user = await User.findOne({user_name: user_name});

    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        } else {
            const message: string = "Invalid password"
            throw new Error.ValidatorError({message});
        }
    }

    const message: string = "Invalid user"
    throw new Error.ValidatorError({message});
}



class UserController {
    async loginGet (req: Request, res: Response) {
    
        res.render('login')

    }
    
    
    async loginPost (req: Request, res: Response) {
        const {user_name, password} = req.body

        try {
            const user = await authLogin(user_name, password)
            const token = createToken(user.id) // Convertendo para string porque a minha função não estava reconhecendo o id como str
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            res.status(StatusCodes.OK).json({ auth: "success", user: user._id })
        } catch (error) {
            const errors = errorsHandle(error)
            console.log(errors)
            res.status(StatusCodes.BAD_REQUEST).json(errors)
        }
        
    }
    
    
    async signupGet (req: Request, res: Response) {
        res.render('signup')
    }
    
    
    async signupPost (req: Request, res: Response) {
    
        const {user_name, email, password} = req.body;
    
        try {
            const user = await User.create({user_name, email, password})
            const token = createToken(user.id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge })
            res.status(StatusCodes.CREATED).json({
                user: user._id,
                msg: 'User Created with success!',
            })
        } catch (error) {
            const errors = errorsHandle(error)
            return res.status(StatusCodes.BAD_REQUEST).json({errors})
        } 
    }


    async updateUser (req: Request, res: Response) {
        const {user_name, email, password} = req.body;

        const token = req.cookies.jwt;
        let id = ''

        const decoded = jwt.decode(token)
        if (decoded !== null && typeof decoded === 'object') {
            id = decoded.id
        }
        console.log(id)

        try {
            const user = await User.updateOne({_id: id}, {$set: {user_name: user_name}}, {}).then(() => {
                console.log("User updated with success")
            }).catch((err) => {
                console.log(err)
            })
            res.status(StatusCodes.NO_CONTENT).json({msg: "User updated with success", user})
        } catch (error) {
            const errors = errorsHandle(error)
            return res.status(StatusCodes.BAD_REQUEST).json({errors})
        }   
    }


    logoutGet (req: Request, res: Response) {
        res.cookie('jwt', '', {maxAge: 1})
        res.redirect('/');
    }




}

const UserControll = new UserController();



export default UserControll;