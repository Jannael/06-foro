import { Request, Response } from 'express'

export const ThreadController = {
  getAll: function (req: Request, res: Response) {
    res.send('getAll')
  },

  getById: function (req: Request, res: Response) {
    res.send('getById')
  },

  create: function (req: Request, res: Response) {
    res.send('create')
  },

  update: function (req: Request, res: Response) {
    res.send('update')
  },

  delete: function (req: Request, res: Response) {
    res.send('delete')
  }
}
