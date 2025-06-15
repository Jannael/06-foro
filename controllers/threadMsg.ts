import { Request, Response } from 'express'
import { connection } from '../database/connect'
import { ThreadMsgModel } from '../models/threadMsg'
import { CustomRequest } from '../interfaces/interfaces'
import { UserBadRequestError } from '../errors/errors'

export const ThreadMsgController = {
  getAll: async function (req: Request, res: Response) {
    const threadId = req.body.threadId
    const response = await ThreadMsgModel.getAll(threadId, await connection)
    res.send(response)
  },

  createMsg: async function (req: Request, res: Response) {
    const { threadId, msg } = req.body
    const id = (req as CustomRequest).UserId

    if (threadId === undefined || threadId === '' || msg === undefined || msg === '') {
      res.status(400).send('Invalid or missing data')
      return
    }

    try {
      const response = await ThreadMsgModel.createMsg(id, threadId, msg, await connection)
      res.send(response)
    } catch (e) {
      if (e instanceof UserBadRequestError) {
        res.status(400).json({ message: 'Invalid or missing data' })
      }
      res.status(500).json({ message: 'Error creating thread' })
    }
  },

  updateMsg: async function (req: Request, res: Response) {
    const { threadId, msgId, msg } = req.body
    const id = (req as CustomRequest).UserId

    if (threadId === undefined || threadId === '' || msgId === undefined || msgId === '' || msg === undefined || msg === '') {
      res.status(400).send('Invalid or missing data')
      return
    }

    try {
      await ThreadMsgModel.updateMsg(id, threadId, msgId, msg, await connection)
      res.json({ message: 'Msg updated' })
    } catch (e) {
      if (e instanceof UserBadRequestError) {
        res.status(400).json({ message: 'Invalid or missing data' })
      }
      res.status(500).json({ message: 'Error updating thread' })
    }
  },

  deleteMsg: async function (req: Request, res: Response) {
    const { threadId, msgId } = req.body
    const id = (req as CustomRequest).UserId

    if (threadId === undefined || threadId === '' || msgId === undefined || msgId === '') {
      res.status(400).send('Invalid or missing data')
      return
    }

    try {
      await ThreadMsgModel.deleteMsg(id, threadId, msgId, await connection)
      res.json({ message: 'Thread deleted' })
    } catch (e) {
      if (e instanceof UserBadRequestError) {
        res.status(400).json({ message: 'Invalid or missing data' })
      }
      res.status(500).json({ message: 'Error deleting thread' })
    }
  }
}
