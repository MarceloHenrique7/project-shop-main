import { Error } from "mongoose";
import User from "../../database/models/User";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';

dotenv.config();


export const passwordHash = async (password: string): Promise<string | undefined> => {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    return passwordHash
}


export const authLogin = async (user_name: string, password: string) => {
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
export const authLoginById = async (id: string, password: string) => {
    const user = await User.findOne({_id: id});

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