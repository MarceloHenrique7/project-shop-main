
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


const verify = (token: string): IJwtData | 'JWT_SECRET_NOT_FOUND' | 'INVALID_TOKEN' => {
    if(!process.env.SECRET_KEY_SIGN) return 'JWT_SECRET_NOT_FOUND'

    try {
    const decoded = jwt.verify(token, `${SECRET_KEY_SIGN}`)
    console.log(decoded)

    if (typeof decoded === 'string') {
        return 'INVALID_TOKEN'
    }
    
        return decoded as IJwtData
    }

    catch (error) {
        return 'INVALID_TOKEN'
    }

}



export const JWTService = {
    createToken,
    verify
}