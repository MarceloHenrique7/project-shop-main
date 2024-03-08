import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../../shared/services/JWTService";
import User from "../../database/models/User";
import { errorsHandle } from "../../shared/middleware/signupValidationError";

const maxAge = 3 * 24 * 60 * 60

export const signupGet = (req: Request, res: Response) => {
        
    if (res.locals.user != null) {
        return res.redirect('/home')
    }
    res.render('signup')
}


export const signupPost = async (req: Request, res: Response) => {
    
    const {user_name, email, password} = req.body;

    try {
        const user = await User.create({user_name, email, password})
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