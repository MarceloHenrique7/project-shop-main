import { Request, Response } from "express";
import { isEmail } from "validator";
import User from "../../database/models/User";
import { StatusCodes } from "http-status-codes";
import { errorsHandle } from "../../shared/middleware/signupValidationError";
import * as jwt from "jsonwebtoken";



export const updateGet = (req: Request, res: Response) => {
        
    if (res.locals.user == null) {
        return res.redirect('/home')
    }
    res.render('update')
}




export const updateUser = async (req: Request, res: Response) => {
    const {user_name, email, password} = req.body;

    console.log(isEmail(email))

    const token = req.cookies.jwt;
    let id = ''

    const decoded = jwt.decode(token)
    if (decoded !== null && typeof decoded === 'object') {
        id = decoded.id
    }
    console.log(user_name, email, password)

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