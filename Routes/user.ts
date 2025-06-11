import { Router } from 'express'

export const UserRouter = Router()

UserRouter.post('/register', UserController.create)
UserRouter.patch('/update', UserController.update)
UserRouter.delete('/delete', UserController.delete)

UserRouter.post('/login', UserController.login)
UserRouter.post('/logout', UserController.logout)
