import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import {
  DatabaseError,
  MissingDataError,
  DuplicateEntryError,
  UserBadRequestError
} from '../errors/errors'

dotenv.config()

const salt = Number(process.env.SALT as string)

export const UserModel = {
  create: async function (name: string, email: string, password: string, connection: mysql.Connection) {
    if (name === '' || email === '' || password === '') {
      throw new MissingDataError('Missing data')
    }

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

      const id = await connection.query(
        'SELECT BIN_TO_UUID(ID) AS ID FROM USER WHERE NAME = ?',
        [name]
      )

      await connection.commit()
      return { name, email, password, id: id[0] }
    } catch (e) {
      if ((e as Error).message.includes('Duplicate entry')) {
        throw new DuplicateEntryError('Duplicate entry')
      }

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
        'UPDATE USER SET ? WHERE ID = UUID_TO_BIN(?)',
        [cleanObject, id]
      )

      await connection.commit()
      return cleanObject
    } catch (e) {
      await connection.rollback()

      if (e instanceof MissingDataError) {
        throw new MissingDataError('Missing data')
      }

      throw new DatabaseError('Error updating user')
    }
  },

  delete: async function (id: string, connection: mysql.Connection) {
    if (id === '') {
      throw new MissingDataError('Missing data')
    }
    try {
      await connection.beginTransaction()

      await connection.query('DELETE FROM USER WHERE ID = UUID_TO_BIN(?)', [id])

      await connection.commit()
      return { id }
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error deleting user')
    }
  },

  login: async function (name: string, password: string, connection: mysql.Connection) {
    if (name === '' || password === '') {
      throw new MissingDataError('Missing data')
    }

    try {
      const response = await connection.query(
        'SELECT PASSWORD FROM USER WHERE NAME = ?',
        [name]
      )

      const PASSWORD = await bcrypt.compare(password, (response as any)[0][0].PASSWORD)

      if (!PASSWORD) {
        throw new UserBadRequestError('Invalid password')
      }

      return { name }
    } catch (e) {
      if (e instanceof UserBadRequestError) {
        throw new UserBadRequestError('Invalid password')
      }
      throw new DatabaseError('Error logging in user')
    }
  }
}
