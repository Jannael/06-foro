import { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function MFA (req: Request, res: Response, next: NextFunction): void {
  const isVerifiedEmail = req.cookies.emailVerified
  const booleanEmailVerified = jsonwebtoken.verify(isVerifiedEmail, process.env.JWT_SECRET as string) as { emailVerified: boolean }

  if (!booleanEmailVerified.emailVerified) {
    res.status(401).send('Unauthorized, please verify your email')
    return
  }

  res.clearCookie('emailVerified')
  next()
}
