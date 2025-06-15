import { Router } from 'express'
import { ThreadMsgController } from '../controllers/threadMsg'

export const ThreadMsgRouter = Router()

ThreadMsgRouter.post('/createMsg', ThreadMsgController.createMsg)
ThreadMsgRouter.patch('/updateMsg', ThreadMsgController.updateMsg)
ThreadMsgRouter.delete('/deleteMsg', ThreadMsgController.deleteMsg)
