import { Router } from 'express'
import { ThreadMsgController } from '../controllers/threadMsg'
import { ThreadRouter } from './thread'
import { UserLogin } from '../middlewares/UserLogin'

export const ThreadMsgRouter = Router()

ThreadRouter.get('/', ThreadMsgController.getAll)
ThreadMsgRouter.post('/createMsg', UserLogin, ThreadMsgController.createMsg)
ThreadMsgRouter.patch('/updateMsg', ThreadMsgController.updateMsg)
ThreadMsgRouter.delete('/deleteMsg', ThreadMsgController.deleteMsg)
