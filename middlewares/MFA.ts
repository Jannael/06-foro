import { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function MFA (req: Request, res: Response, next: NextFunction): void {
  const { email } = req.body
  const isVerifiedEmail = req.cookies.emailVerified
  const booleanEmailVerified = jsonwebtoken.verify(isVerifiedEmail, process.env.JWT_SECRET as string) as { emailVerified: boolean, email: string }

  if (!booleanEmailVerified.emailVerified) {
    res.status(401).send('Unauthorized, please verify your email')
    return
  }

  if (email !== booleanEmailVerified.email) {
    res.status(401).send('Unauthorized, please verify your email')
    return
  }

  res.clearCookie('emailVerified')
  next()
}

export function MFALogin (req: Request, res: Response, next: NextFunction): void {
  const isVerifiedEmail = req.cookies.codeToVerifyEmailLogin
  const code = req.body.code
  const secureCode = jsonwebtoken.verify(isVerifiedEmail, process.env.JWT_SECRET as string) as { code: number }

  if (secureCode.code !== code) {
    res.status(401).send('Unauthorized, please verify your email')
    return
  }

  res.clearCookie('codeToVerifyEmailLogin')
  next()
}
