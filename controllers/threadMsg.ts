import { Request, Response } from 'express'
import { connection } from '../database/connect'
import { ThreadMsgModel } from '../models/threadMsg'

export const ThreadMsgController = {
  getAll: async function (req: Request, res: Response) {
    const threadId = req.body.threadId
    const response = await ThreadMsgModel.getAll(threadId, await connection)
    res.send(response)
  },

  createMsg: async function (req: Request, res: Response) {},
  updateMsg: async function (req: Request, res: Response) {},
  deleteMsg: async function (req: Request, res: Response) {}
}
