import jwt from "jsonwebtoken";
import User from "../../database/models/User";
import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';

dotenv.config()

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    
    if (token) {
        jwt.verify(token, `${process.env.SECRET_KEY_SIGN}`, (err: any, decodedToken: any) => {
            if (err) {
                res.redirect('/login')
                console.log(err)
            } else {
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}



const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, `${process.env.SECRET_KEY_SIGN}`, async (err: any, decodedToken: any) => {
            if (err) {
                console.log(err)
                res.locals.user = null
                next()
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null; // se o token nao existe significa que o user n esta logado, então define como null
        next()
    }

}


export {requireAuth, checkUser};