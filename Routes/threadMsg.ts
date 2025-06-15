import { Router } from 'express'
import { ThreadMsgController } from '../controllers/threadMsg'
import { UserLogin } from '../middlewares/UserLogin'

export const ThreadMsgRouter = Router()

ThreadMsgRouter.get('/', ThreadMsgController.getAll)
ThreadMsgRouter.post('/createMsg', UserLogin, ThreadMsgController.createMsg)
ThreadMsgRouter.patch('/updateMsg', UserLogin, ThreadMsgController.updateMsg)
ThreadMsgRouter.delete('/deleteMsg', UserLogin, ThreadMsgController.deleteMsg)
