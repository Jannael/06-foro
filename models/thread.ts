import mysql from 'mysql2/promise'
import {
  UserBadRequestError
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
  }
}
