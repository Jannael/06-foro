import { Router } from 'express'
import { UserController } from '../controllers/user'

export const UserRouter = Router()

UserRouter.post('/register', UserController.create)
UserRouter.patch('/update', UserController.update)
UserRouter.delete('/delete', UserController.delete)

UserRouter.post('/login', UserController.login)
UserRouter.post('/logout', UserController.logout)
