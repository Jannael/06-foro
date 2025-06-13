import { Request, Response } from 'express'
import { UserModel } from '../models/user'
import { CustomRequest } from '../interfaces/interfaces'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import {
  DatabaseError,
  MissingDataError,
  DuplicateEntryError
} from '../errors/errors'
import { sendEmail, generateCode } from '../utils/utils'
import connectDB from '../database/connect'

dotenv.config()

const connection = connectDB()

export const UserController = {
  create: async function (req: Request, res: Response) {
    const { name, email, password } = req.body

    if (name === '' || email === '' || password === '') {
      res.status(400)
      return
    }

    try {
      const response = await UserModel.create(name, email, password, await connection)
      const id = response.id

      const accessToken = jsonwebtoken.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
      const refreshToken = jsonwebtoken.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

      res.cookie('accessToken', accessToken, { httpOnly: true })
      res.cookie('refreshToken', refreshToken, { httpOnly: true })
      res.status(201)
    } catch (e) {
      if (e instanceof DuplicateEntryError) {
        res.status(400).json({ message: 'Duplicate User' })
      } else if (e instanceof DatabaseError) {
        res.status(500).json({ message: 'Server is not responding' })
      } else {
        res.status(500).json({ message: 'Error creating user' })
      }
    }
  },

  update: async function (req: Request, res: Response) {
    const userId = (req as CustomRequest).UserId
    const data = req.body

    if (userId === '' || data === undefined) {
      res.status(400)
    }

    try {
      const response = await UserModel.update(userId, data, await connection)
      res.status(200).json(response)
    } catch (e) {
      if (e instanceof MissingDataError) {
        res.status(400).json({ message: 'Missing data' })
      } else if (e instanceof DatabaseError) {
        res.status(500).json({ message: 'Server is not responding' })
      } else {
        res.status(500).json({ message: 'Error updating user' })
      }
    }
  },

  delete: async function (req: Request, res: Response) {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    try {
      await UserModel.delete((req as CustomRequest).UserId, await connection)
      res.status(204)
    } catch (e) {
      res.status(500).json({ message: 'Error deleting user' })
    }
  },

  login: function (req: Request, res: Response) {
  },

  logout: function (req: Request, res: Response) {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(200).send('Logged out')
  },

  askForCode: async function (req: Request, res: Response) {
    const { email } = req.body
    const code = generateCode()
    const encryptedCode = jsonwebtoken.sign({ code }, process.env.JWT_SECRET as string, { expiresIn: '5m' })

    await sendEmail(email, code)
    res.cookie('codeToVerifyEmail', encryptedCode, { httpOnly: true })
    res.status(200).send('Email sent')
  },

  verifyCode: async function (req: Request, res: Response) {
    const { codeToVerifyEmail } = req.cookies
    const { code } = req.body

    if (codeToVerifyEmail === undefined || code === undefined) {
      res.status(400).send('Invalid or missing data')
      return
    }

    const verifyCode = jsonwebtoken.verify(codeToVerifyEmail, process.env.JWT_SECRET as string) as { code: number }

    if (verifyCode.code !== code) {
      res.status(400).send('Invalid code')
      return
    }
    const signBoolean = jsonwebtoken.sign({ emailVerified: true }, process.env.JWT_SECRET as string, { expiresIn: '5m' })

    res.clearCookie('codeToVerifyEmail')
    res.cookie('emailVerified', signBoolean, { httpOnly: true })
    res.status(200).send('email verified')
  },

  refreshToken: async function (req: Request, res: Response) {
    const { refreshToken } = req.cookies
    const verifyRefreshToken = jsonwebtoken.verify(refreshToken, process.env.JWT_SECRET as string) as { id: string }

    if (verifyRefreshToken.id === undefined) {
      res.status(401).send('You are not logged in')
      return
    }

    const signRefreshToken = jsonwebtoken.sign({ id: verifyRefreshToken.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })
    const accessToken = jsonwebtoken.sign({ id: verifyRefreshToken.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
    res.cookie('refreshToken', signRefreshToken, { httpOnly: true })
    res.cookie('accessToken', accessToken, { httpOnly: true })
    res.status(200).send('Token refreshed')
  }
}
