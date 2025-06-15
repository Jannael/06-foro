import { Router } from 'express'
import { ThreadController } from '../controllers/thread'
import { UserLogin } from '../middlewares/UserLogin'

export const ThreadRouter = Router()

ThreadRouter.get('/', ThreadController.getAll)
ThreadRouter.post('/', UserLogin, ThreadController.createThread)
ThreadRouter.patch('/:id', ThreadController.update)
ThreadRouter.delete('/:id', ThreadController.delete)
