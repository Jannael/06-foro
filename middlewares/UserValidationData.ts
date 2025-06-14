import zod from 'zod'
import { Request, Response, NextFunction } from 'express'
import {
  UserBadRequestError
} from '../errors/errors'

const UserDataSchema = zod.object({
  name: zod.string().min(3).max(255),
  email: zod.string().email(),
  password: zod.string().min(6).max(255)
})

export async function UserValidationData (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await UserDataSchema.parseAsync(req.body)
    req.body = data
    next()
  } catch (e) {
    res.status(400).send(new UserBadRequestError('Invalid or missing data'))
  }
}

export async function UserValidationDataPartial (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = UserDataSchema.partial().parse(req.body)

    if (data === undefined) {
      res.status(400).send(new UserBadRequestError('Invalid or missing data'))
    }

    if (data.password === undefined) {
      res.status(401).send('Unauthorized')
    }
    req.body = data
    next()
  } catch (e) {
    res.status(400).send(new UserBadRequestError('Invalid or missing data'))
  }
}

export async function UserValidationEmail (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const emailSchema = zod.object({
      email: zod.string().email(),
      testCode: zod.string().min(6).max(255).optional()
    })

    const data = await emailSchema.parseAsync(req.body)

    if (data.testCode !== undefined && data.testCode !== process.env.SECRET_CODE_TEST) {
      res.status(400).send('get out of here')
    }

    req.body = data
    next()
  } catch (e) {
    res.status(400).send(new UserBadRequestError('Invalid or missing data'))
  }
}
