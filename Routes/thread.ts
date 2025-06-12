import { Router } from 'express'
import { ThreadController } from '../controllers/thread'

export const ThreadRouter = Router()

ThreadRouter.get('/', ThreadController.getAll)
ThreadRouter.get('/:id', ThreadController.getMsgById)

ThreadRouter.post('/', ThreadController.create)
ThreadRouter.patch('/:id', ThreadController.update)
ThreadRouter.delete('/:id', ThreadController.delete)
