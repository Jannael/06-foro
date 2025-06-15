import { Router } from 'express'
import { ThreadMsgController } from '../controllers/threadMsg'
import { ThreadRouter } from './thread'

export const ThreadMsgRouter = Router()

ThreadRouter.get('/', ThreadMsgController.getAll)
ThreadMsgRouter.post('/createMsg', ThreadMsgController.createMsg)
ThreadMsgRouter.patch('/updateMsg', ThreadMsgController.updateMsg)
ThreadMsgRouter.delete('/deleteMsg', ThreadMsgController.deleteMsg)
