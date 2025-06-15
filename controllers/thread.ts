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

  update: async function (req: Request, res: Response) {
    const id = (req as CustomRequest).UserId
    const { threadId, name, description } = req.body

    if (threadId === undefined || threadId === '') {
      res.status(400).send('Invalid or missing data')
      return
    }

    try {
      const data = { name, description }
      await ThreadModel.update(id, threadId, data, await connection)
      res.json({ message: 'Thread updated' })
    } catch (e) {
      res.status(500).json({ message: 'Error updating thread' })
    }
  },

  delete: function (req: Request, res: Response) {
    res.send('delete')
  }
}
