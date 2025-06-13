import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export function notNullValues (obj: { [key: string]: any }): { [key: string]: any } {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null)
  )
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string
  }
})

export function verifyEmail (email: string): boolean {
  const rgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!rgx.test(email)) {
    return false
  }
  return true
}

export function generateCode (): number {
  return Math.floor(Math.random() * 10000)
}

export async function sendEmail (email: string, code: number): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL as string,
    to: email,
    subject: 'Verify your email',
    text: `Your verification code is ${code}`
  })
}
