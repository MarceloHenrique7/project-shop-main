import User from "../../database/models/User";
import { JWTService } from "../services/JWTService";
import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import { StatusCodes } from "http-status-codes";

dotenv.config()


export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        const isValid = await JWTService.verify(token)
        if (isValid === 'JWT_SECRET_NOT_FOUND') {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: 'user unauthenticated'
                }
            })
            return next();
        }
        if (isValid === 'INVALID_TOKEN') {
            res.locals.user = null;
            res.status(StatusCodes.UNAUTHORIZED).json({
                errors: {
                    default: 'INVALID_TOKEN'
                }
            })
            return next();
        }
        let user = await User.findById(isValid.uid);
        res.locals.user = user;
        return next();
    }
    res.locals.user = null;
    return next();

}
