import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidationData } from '../middlewares/UserValidationData'

export const UserRouter = Router()

UserRouter.post('/register', UserValidationData, UserController.create)
UserRouter.patch('/update', UserController.update)
UserRouter.delete('/delete', UserController.delete)

UserRouter.post('/login', UserController.login)
UserRouter.post('/logout', UserController.logout)
