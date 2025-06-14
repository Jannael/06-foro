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

export const connection = connectDB()

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
      res.sendStatus(201)
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

  /* TODO */ update: async function (req: Request, res: Response) {
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
      res.sendStatus(204)
    } catch (e) {
      res.status(500).json({ message: 'Error deleting user' })
    }
  },

  verifyLogin: async function (req: Request, res: Response) {
    const { name, password, email } = req.body

    if (name === '' || password === '' || email === '') {
      res.status(400).send('Invalid or missing data')
      return
    }

    try {
      const emailVerified = await UserModel.verifyEmail(name, email, await connection)

      if (!emailVerified.emailVerified) {
        res.status(400).send('Invalid email')
        return
      }

      const code = generateCode()
      const encryptedCode = jsonwebtoken.sign({ code }, process.env.JWT_SECRET as string, { expiresIn: '5m' })

      await sendEmail(email, code)
      res.cookie('codeToVerifyEmailLogin', encryptedCode, { httpOnly: true })
      res.status(200).send('Email sent')
    } catch (e) {
      res.status(500).json({ message: 'Error logging in user please try again' })
    }
  },

  login: async function (req: Request, res: Response) {
    const { name, password, email } = req.body

    if (name === '' || password === '' || email === '') {
      res.status(400).send('Invalid or missing data')
      return
    }

    try {
      const emailVerified = await UserModel.verifyEmail(name, email, await connection)
      if (!emailVerified.emailVerified) {
        res.status(400).send('Invalid email')
        return
      }

      const id = await UserModel.login(name, password, await connection)

      const accessToken = jsonwebtoken.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
      const refreshToken = jsonwebtoken.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

      res.cookie('accessToken', accessToken, { httpOnly: true })
      res.cookie('refreshToken', refreshToken, { httpOnly: true })
      res.status(200).send('Logged in')
    } catch (e) {
      res.status(500).json({ message: 'Error logging in user please try again' })
    }
  },

  logout: function (req: Request, res: Response) {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(200).send('Logged out')
  },

  askForCode: async function (req: Request, res: Response) {
    const { email, testCode } = req.body
    const code = testCode !== undefined && testCode === process.env.SECRET_CODE_TEST ? 1234 : generateCode()
    const encryptedCode = jsonwebtoken.sign({ code, email }, process.env.JWT_SECRET as string, { expiresIn: '5m' })

    if (email === undefined || email === '') {
      res.status(400).send('Invalid or missing data')
      return
    }

    await sendEmail(email, code)
    res.cookie('codeToVerifyEmail', encryptedCode, { httpOnly: true })
    res.status(200).send('Email sent')
  },

  verifyCode: async function (req: Request, res: Response) {
    const { codeToVerifyEmail } = req.cookies
    const { code, email } = req.body
    if (codeToVerifyEmail === undefined || code === undefined) {
      res.status(400).send('Invalid or missing data')
      return
    }

    const verifyCode = jsonwebtoken.verify(codeToVerifyEmail, process.env.JWT_SECRET as string) as { code: number, email: string }
    if (verifyCode.code !== Number(code)) {
      res.status(400).send('Invalid code')
      return
    }

    if (verifyCode.email !== email) {
      res.status(400).send('Invalid email')
      return
    }

    const signBoolean = jsonwebtoken.sign({ emailVerified: true, email }, process.env.JWT_SECRET as string, { expiresIn: '5m' })

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

    const accessToken = jsonwebtoken.sign({ id: verifyRefreshToken.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
    const signRefreshToken = jsonwebtoken.sign({ id: verifyRefreshToken.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

    res.cookie('accessToken', accessToken, { httpOnly: true })
    res.cookie('refreshToken', signRefreshToken, { httpOnly: true })
    res.status(200).send('Token refreshed')
  }
}
