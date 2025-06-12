import { Request, Response } from 'express'
import { UserModel } from '../models/user'
import { CustomRequest } from '../interfaces/interfaces'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const UserController = {
  create: async function (req: Request, res: Response) {
    const { name, email, password } = req.body
    const connection = (req as CustomRequest).connectionDB

    if (name === '' || email === '' || password === '') {
      res.status(400)
      return
    }

    try {
      const response = await UserModel.create(name, email, password, connection)
      const id = response.id

      const accessToken = jsonwebtoken.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
      const refreshToken = jsonwebtoken.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

      res.cookie('accessToken', accessToken, { httpOnly: true })
      res.cookie('refreshToken', refreshToken, { httpOnly: true })
      res.status(201)
    } catch (e) {
      res.status(500).json({ message: 'Error creating user' })
    }
  },

  update: function (req: Request, res: Response) {
  },

  delete: function (req: Request, res: Response) {
  },

  login: function (req: Request, res: Response) {
  },

  logout: function (req: Request, res: Response) {
  }
}
