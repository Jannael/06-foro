import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidationData, UserValidationDataPartial } from '../middlewares/UserValidationData'
import { UserLogin } from '../middlewares/UserLogin'

export const UserRouter = Router()

UserRouter.post('/register', UserValidationData, UserController.create)
UserRouter.post('/askForCode', UserValidationData, UserController.askForCode)
UserRouter.post('/verifyCode', UserValidationData, UserController.verifyCode)
UserRouter.patch('/update', UserLogin, UserValidationDataPartial, UserController.update)
UserRouter.delete('/delete', UserController.delete)

UserRouter.post('/login', UserController.login)
UserRouter.post('/logout', UserController.logout)
