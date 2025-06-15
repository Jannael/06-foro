import { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { CustomRequest } from '../interfaces/interfaces'

export async function UserLogin (req: Request, res: Response, next: NextFunction): Promise<void> {
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  if (accessToken === undefined || refreshToken === undefined) {
    res.status(401).send('Unauthorized')
    return
  }

  try {
    const { id } = jsonwebtoken.verify(accessToken, process.env.JWT_SECRET as string) as { id: string }
    (req as CustomRequest).UserId = id
    next()
  } catch (e) {
    console.log(e)
    res.status(401).send('Unauthorized')
  }
}
