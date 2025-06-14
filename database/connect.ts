import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

export default async function createConnection (): Promise<mysql.Connection> {
  dotenv.config()

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  })

  return connection
}
