import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidationData, UserValidationDataPartial } from '../middlewares/UserValidationData'
import { UserLogin } from '../middlewares/UserLogin'
import { MFA } from '../middlewares/MFA'

export const UserRouter = Router()

UserRouter.post('/register', MFA, UserValidationData, UserController.create)
UserRouter.post('/askForCode', UserValidationData, UserController.askForCode)
UserRouter.post('/verifyCode', UserValidationData, UserController.verifyCode)
UserRouter.get('/refreshToken', UserValidationData, UserController.refreshToken)

UserRouter.patch('/update', MFA, UserLogin, UserValidationDataPartial, UserController.update)
UserRouter.delete('/delete', MFA, UserLogin, UserController.delete)

UserRouter.post('/login', MFA, UserController.login)
UserRouter.post('/logout', UserController.logout)
