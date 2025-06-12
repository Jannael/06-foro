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
