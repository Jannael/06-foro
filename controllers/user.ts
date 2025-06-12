import { Request, Response } from 'express'

export const UserController = {
  create: function (req: Request, res: Response) {
    res.send('create')
  },

  update: function (req: Request, res: Response) {
    res.send('update')
  },

  delete: function (req: Request, res: Response) {
    res.send('delete')
  },

  login: function (req: Request, res: Response) {
    res.send('login')
  },

  logout: function (req: Request, res: Response) {
    res.send('logout')
  }
}
