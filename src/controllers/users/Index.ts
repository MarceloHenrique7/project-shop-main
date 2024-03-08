import * as signIn from './SignIn'
import * as signUp from './SignUp'
import * as logout from './Logout'
import * as update from './Update'



export const userController = {
    ...signIn,
    ...signUp,
    ...update,
    ...logout
}