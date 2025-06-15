import { Request, Response } from 'express'
import { ThreadModel } from '../models/thread'
import { connection } from '../database/connect'
import { CustomRequest } from '../interfaces/interfaces'

export const ThreadController = {
  getAll: async function (req: Request, res: Response) {
    const response = await ThreadModel.getAll(await connection)
    res.send(response)
  },

  createThread: async function (req: Request, res: Response) {
    const { name, description } = req.body
    const id = (req as CustomRequest).UserId

    try {
      const response = await ThreadModel.create(id, name, description, await connection)
      res.send(response)
    } catch (e) {
      res.status(500).json({ message: 'Error creating thread' })
    }
  },

  update: function (req: Request, res: Response) {
    res.send('update')
  },

  delete: function (req: Request, res: Response) {
    res.send('delete')
  }
}
