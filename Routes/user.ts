import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidationData } from '../middlewares/UserValidationData'
import { UserLogin } from '../middlewares/UserLogin'
import { MFA, MFALogin } from '../middlewares/MFA'

export const UserRouter = Router()

UserRouter.post('/register', MFA, UserValidationData, UserController.create)
UserRouter.post('/askForCode', UserValidationData, UserController.askForCode)
UserRouter.post('/verifyCode', UserValidationData, UserController.verifyCode)
UserRouter.get('/refreshToken', UserLogin, UserController.refreshToken)

// UserRouter.patch('/update', MFA, UserLogin, UserValidationDataPartial, UserController.update)
// UserRouter.delete('/delete', MFA, UserLogin, UserController.delete)

// first you need to send name, email and password, if your email is correct with the code in db will send you a code to verify your email
UserRouter.post('/loginValidation', UserValidationData, UserController.verifyLogin)
// with the code we send in the email, we will check if the user actually its the owner of the email and we will send credentials as cookies
UserRouter.post('/login', MFALogin, UserValidationData, UserController.login)

UserRouter.post('/logout', UserController.logout)
