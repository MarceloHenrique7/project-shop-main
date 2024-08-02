
import * as jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config()

interface IJwtData {
    uid: number;
}

const SECRET_KEY_SIGN = process.env.SECRET_KEY_SIGN
const maxAge = 3 * 24 * 60 * 60

const createToken = (id: string) => {
    return jwt.sign({id}, `${SECRET_KEY_SIGN}`, {
        expiresIn: maxAge,
    })
}


export const JWTService = {
    createToken
}