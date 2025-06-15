import mysql from 'mysql2/promise'
import {
  UserBadRequestError,
  DatabaseError
} from '../errors/errors'
import { notNullValues } from '../utils/utils'

export const ThreadModel = {
  getAll: async function (connection: mysql.Connection) {
    const [rows] = await connection.query('SELECT * FROM THREAD')
    return rows
  },

  create: async function (userId: string, name: string, description: string, connection: mysql.Connection) {
    if (name === '' || description === '' || userId === '') {
      throw new UserBadRequestError('Missing data')
    }

    try {
      await connection.beginTransaction()
      await connection.query(
        'INSERT INTO THREAD (USER_ID, NAME, DESCRIPTION) VALUES (UUID_TO_BIN(?), ?, ?)',
        [userId, name, description]
      )

      const threadId = await connection.query(
        'SELECT BIN_TO_UUID(ID) AS ID FROM THREAD WHERE USER_ID = UUID_TO_BIN(?) AND NAME = ? AND DESCRIPTION = ?',
        [userId, name, description]
      )

      await connection.commit()
      return { threadId: (threadId as any)[0][0].ID, userId, name, description }
    } catch (error) {
      await connection.rollback()
      throw new DatabaseError('Error creating thread')
    }
  },

  update: async function (userId: string, threadId: string, data: { name?: string, description?: string }, connection: mysql.Connection) {
    if (userId === '' || threadId === '' || data === undefined || (data.name === undefined && data.description === undefined)) {
      throw new UserBadRequestError('Missing data')
    }

    try {
      const entries = { NAME: data.name, DESCRIPTION: data.description }
      const values = notNullValues(entries)

      await connection.beginTransaction()
      await connection.query(
        'UPDATE THREAD SET ? WHERE USER_ID = UUID_TO_BIN(?) AND ID = UUID_TO_BIN(?)',
        [values, userId, threadId]
      )
      await connection.commit()
      return { userId }
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error updating thread')
    }
  },

  delete: async function (userId: string, threadId: string, connection: mysql.Connection) {
    if (userId === '' || threadId === '') {
      throw new UserBadRequestError('Missing data')
    }

    try {
      await connection.beginTransaction()

      await connection.query(
        'DELETE FROM THREAD_MSG WHERE ID_THREAD = UUID_TO_BIN(?) AND ID_USER = UUID_TO_BIN(?)',
        [threadId, userId]
      )

      await connection.query(
        'DELETE FROM THREAD WHERE USER_ID = UUID_TO_BIN(?) AND ID = UUID_TO_BIN(?)',
        [userId, threadId]
      )

      await connection.commit()
      return { userId }
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error deleting thread')
    }
  }
}
