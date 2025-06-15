import { Request, Response } from 'express'
import { ThreadModel } from '../models/thread'
import { connection } from '../database/connect'

export const ThreadController = {
  getAll: async function (req: Request, res: Response) {
    const response = await ThreadModel.getMsgById(req.params.id, await connection)
    res.send(response)
  },

  getMsgById: function (req: Request, res: Response) {
    res.send('getById')
  },

  createThread: function (req: Request, res: Response) {
    res.send('create')
  },

  update: function (req: Request, res: Response) {
    res.send('update')
  },

  delete: function (req: Request, res: Response) {
    res.send('delete')
  }
}
