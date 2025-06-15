import { Router } from 'express'
import { ThreadController } from '../controllers/thread'

export const ThreadRouter = Router()

ThreadRouter.get('/', ThreadController.getAll)
ThreadRouter.post('/', ThreadController.createThread)
ThreadRouter.patch('/:id', ThreadController.update)
ThreadRouter.delete('/:id', ThreadController.delete)
