import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import { DatabaseError, MissingDataError } from '../errors/errors'

dotenv.config()

// const connection = await mysql.createConnection({
// host: process.env.DB_HOST as string,
// user: process.env.DB_USER as string,
// password: process.env.DB_PASSWORD as string,
// database: process.env.DB_NAME
// })

const salt = Number(process.env.SALT as string)

export const UserModel = {
  create: async function (name: string, email: string, password: string, connection: mysql.Connection) {
    try {
      await connection.beginTransaction()

      const hashValues = {
        NAME: name,
        EMAIL: await bcrypt.hash(email, salt),
        PASSWORD: await bcrypt.hash(password, salt)
      }

      await connection.query(
        'INSERT INTO USER (NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)',
        Object.values(hashValues)
      )

      await connection.commit()
      return { name, email, password }
    } catch (e) {
      console.log(e)
      await connection.rollback()
      throw new DatabaseError('Error creating user')
    }
  },

  update: async function (id: string, data: { name?: string, email?: string, password?: string }, connection: mysql.Connection) {
    try {
      await connection.beginTransaction()

      const hashValues = {
        NAME: data.name ?? undefined,
        EMAIL: (data.email !== undefined) ? await bcrypt.hash(data.email, salt) : undefined,
        PASSWORD: (data.password !== undefined) ? await bcrypt.hash(data.password, salt) : undefined
      }

      const cleanObject = Object.fromEntries(
        Object.entries(hashValues).filter(([_, value]) => value != null)
      )

      if (Object.keys(cleanObject).length === 0 || id === '') {
        throw new MissingDataError('Missing data')
      }

      await connection.query(
        'UPDATE USER SET ? WHERE ID = ?',
        [cleanObject, id]
      )

      await connection.commit()
      return cleanObject
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error updating user')
    }
  },

  delete: async function (id: string, connection: mysql.Connection) {
    try {
      await connection.beginTransaction()

      await connection.query('DELETE FROM USER WHERE ID = ?', [id])

      await connection.commit()
      return { id }
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error deleting user')
    }
  }
}
