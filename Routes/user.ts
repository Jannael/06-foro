import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidationData } from '../middlewares/UserValidationData'
import { UserLogin } from '../middlewares/UserLogin'
import { MFA, MFALogin } from '../middlewares/MFA'

export const UserRouter = Router()

// you ask for a code with you data and then you validate that code in the email that will add a cookie with the code
UserRouter.post('/askForCode', UserValidationData, UserController.askForCode)
UserRouter.post('/verifyCode', UserValidationData, UserController.verifyCode)
// the cookie with the code will be check and if its correct we will delete it and sned the credentrials as cookies
UserRouter.put('/register', MFA, UserValidationData, UserController.create)
// it tales tje credentials as cookies and sends a new ones
UserRouter.get('/refreshToken', UserLogin, UserController.refreshToken)

// UserRouter.patch('/update', MFA, UserLogin, UserValidationDataPartial, UserController.update)

// first will add a cokit with a code to confirm the delete and send it to the email
UserRouter.delete('/delete', UserLogin, UserController.delete)

// first you need to send name, email and password, if your email is correct with the code in db will send you a code to verify your email
// with the code we send in the email, we will check if the user actually its the owner of the email and we will send credentials as cookies
UserRouter.post('/loginValidation', UserValidationData, UserController.verifyLogin)
UserRouter.post('/login', MFALogin, UserValidationData, UserController.login)

UserRouter.post('/logout', UserController.logout)
