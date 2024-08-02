import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../../shared/services/JWTService";
import User from "../../database/models/User";
import * as yup from 'yup'
import { errorsHandle } from "../../shared/middleware/signupValidationError";
import { IUser } from "../../database/models/UserM";
import { validation } from "../../shared/middleware/Validation";
import { passwordHash } from "../../shared/services/BcryptService";
const maxAge = 3 * 24 * 60 * 60

interface IBodyProps extends IUser {}

export const validationSingUp = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        user_name: yup.string().required().min(6),
        email: yup.string().required().min(5).email(),
        password: yup.string().required().min(5),
    }))
}))



export const signupGet = (req: Request, res: Response) => {
        
    if (res.locals.user != null) {
        return res.redirect('/home')
    }
    res.render('signup')
}


export const signupPost = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    
    const {user_name, email, password} = req.body;
    console.log(user_name, email, password)
    try {
        const passwordCrypt = await passwordHash(password)
        console.log(passwordCrypt)
        const user = await User.create({user_name, email, password: passwordCrypt})
        const token = JWTService.createToken(user.id)
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