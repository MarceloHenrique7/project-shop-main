import { Request, Response } from "express";
import { isEmail } from "validator";
import User from "../../database/models/User";
import { StatusCodes } from "http-status-codes";
import { errorsHandle } from "../../shared/middleware/signupValidationError";
import * as jwt from "jsonwebtoken";
import { validation } from "../../shared/middleware/Validation";
import { IUser } from "../../database/models/UserM";
import * as yup from 'yup'
import { authLogin, authLoginById, passwordHash } from "../../shared/services/BcryptService";

interface IBodyProps extends IUser {}

export const validationUpdate = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        user_name: yup.string().required().min(5),
        email: yup.string().required().min(7).email(),
        password: yup.string().required().min(5),
    }))
}))



export const updateGet = (req: Request, res: Response) => {
        
    if (res.locals.user == null) {
        return res.redirect('/home')
    }
    res.render('update')
}




export const updateUser = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const {user_name, email, password} = req.body;

    console.log(user_name, email, password)

    const token = req.cookies.jwt;
    let id = ''

    const decoded = jwt.decode(token)
    if (decoded !== null && typeof decoded === 'object') {
        id = decoded.id
    }
    

    try {
        const isCorrectPassword = await authLoginById(id, password)
        const [userUpdate, emailUpdate] = await Promise.all([
            await User.updateOne({_id: id}, {$set: {user_name: user_name}}),
            await User.updateOne({_id: id}, {$set: {email: email}}),
        ])

        return res.status(StatusCodes.NO_CONTENT).json({msg: "User updated with success", user: {
            user_name: userUpdate,
            email: emailUpdate,
        }})
    } catch (error) {
        const errors = errorsHandle(error)
        console.log(errors)
        return res.status(StatusCodes.BAD_REQUEST).json({errors})
    }   
}