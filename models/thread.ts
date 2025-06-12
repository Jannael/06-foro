import mysql from 'mysql2/promise'
import { notNullValues } from '../utils/utils'
import {
  UserBadRequestError,
  DatabaseError
} from '../errors/errors'

export const ThreadModel = {
  getAll: async function (connection: mysql.Connection) {
    const [rows] = await connection.query('SELECT * FROM THREAD')
    return rows
  },

  getMsgById: async function (id: string, connection: mysql.Connection) {
    const [rows] = await connection.query(
      `SELECT USER.NAME AS NAME, THREAD_MSG.MSG AS MSG FROM THREAD_MSG
      WHERE ID_THREAD = UUID_TO_BIN(?)
      JOIN USERS ON USERS.ID = THREAD_MSG.ID_USER`,
      [id]
    )
    return rows
  },

  create: async function (userId: string, name: string, description: string, connection: mysql.Connection) {
    if (name === '' || description === '' || userId === '') {
      throw new UserBadRequestError('Missing data')
    }
    try {
      await connection.beginTransaction()
      await connection.query(
        'INSERT INTO THREAD (ID_USER, NAME, DESCRIPTION) VALUES (UUID_TO_BIN(?), ?, ?)',
        [userId, name, description]
      )

      const threadId = await connection.query(
        'SELECT ID FROM THREAD WHERE ID_USER = UUID_TO_BIN(?) AND NAME = ? AND DESCRIPTION = ?',
        [userId, name, description]
      )

      await connection.commit()
      return threadId[0]
    } catch (error) {
    }
  },

  update: async function (userId: string, data: { name?: string, description?: string }, connection: mysql.Connection) {
    if (userId === '' || data === undefined || (data.name === undefined && data.description === undefined)) {
      throw new UserBadRequestError('Missing data')
    }

    try {
      const entries = { NAME: data.name, DESCRIPTION: data.description }
      const values = notNullValues(entries)

      await connection.beginTransaction()
      await connection.query(
        'UPDATE THREAD SET ? WHERE ID_USER = UUID_TO_BIN(?)',
        [values, userId]
      )
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error updating thread')
    }
  }
}
