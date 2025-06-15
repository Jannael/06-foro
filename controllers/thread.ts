import { Request, Response } from 'express'

export const ThreadController = {
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
