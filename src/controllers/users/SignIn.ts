import { Request, Response } from "express";
import { JWTService } from "../../shared/services/JWTService";
import { StatusCodes } from "http-status-codes";
import { authLogin } from "../../shared/services/BcryptService";
import { errorsHandle } from "../../shared/middleware/signupValidationError";
import dotenv from 'dotenv';

dotenv.config();

const maxAge = 3 * 24 * 60 * 60

export const loginGet = (req: Request, res: Response) => {
    
    if (res.locals.user != null) {
        return res.redirect('/home')
    }
    res.render('login')

}
    
    
export const loginPost = async (req: Request, res: Response) => {
const {user_name, password} = req.body

try {
    const user = await authLogin(user_name, password)
    const token = JWTService.createToken(user.id) // Convertendo para string porque a minha função não estava reconhecendo o id como str
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(StatusCodes.OK).json({ auth: "success", user: user._id })
} catch (error) {
    const errors = errorsHandle(error)
    console.log(errors)
    res.status(StatusCodes.BAD_REQUEST).json({errors: errors})
}

}

