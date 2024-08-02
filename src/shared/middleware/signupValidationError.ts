import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import { MongooseError } from 'mongoose';

export const errorsHandle = (err: any) => {
    let errors = {user_name: '', email: '', password: ''}
    


    if ((err as MongoError).code === 11000) {
        const error = Object.values(err as MongoError).map((err) => err)
        if (error[3].hasOwnProperty('user_name')) {
            errors.user_name = 'User name already exists'
        }
        else if (error[3].hasOwnProperty('email')) {
            errors.email = 'E-mail already exists'
        }
    }
    
    if (err instanceof Error.ValidationError || err instanceof Error.ValidatorError) {
        let message: any;
        if (err instanceof Error.ValidationError) {
            message = Object.values(err.errors).map(err => err).toString().toLocaleLowerCase();
        } 
        if (err instanceof Error.ValidatorError) {
            message = Object.values(err.message).join('').toLocaleLowerCase()
        }

        console.log(message)

        if (message.includes('invalid user')) {
            errors.user_name = 'Invalid User'
        }

        if (message.includes('invalid password')) {
            errors.password = 'any field is wrong, correction the field.'
        }
        
        if (message.includes('please enter a username')) {
            errors.user_name = 'please enter a username'
        }
    
        if (message.includes('minimum username length is 6 character')) {
            errors.user_name = 'Minimum username length is 6 character'
        }

        if (message.includes('maximum username length is 20 character')) {
            errors.user_name = 'Maximum username length is 20 character'
        }
    
        if (message.includes('please enter a valid email')) {
            errors.email = 'Please enter a valid email'
        }
    
        if (message.includes('please enter a email')) {
            errors.email = 'please enter a email'
        }
        if (message.includes('please enter a password')) {
            errors.password = 'please enter a password'
        }
    
        if (message.includes('minimum password length is 6 character')) {
            errors.password = 'Minimum password length is 6 character'
        }
    
        if (message.includes('maximum password length is 20 character')) {
            errors.password = 'Maximum password length is 20 character'
        }
    }

    

    return errors
}