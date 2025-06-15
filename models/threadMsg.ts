import mysql from 'mysql2/promise'
import {
  DatabaseError,
  UserBadRequestError
} from '../errors/errors'

export const ThreadMsgModel = {
  getAll: async function (id: string, connection: mysql.Connection) {
    try {
      const [rows] = await connection.query(
          `SELECT 
          USER.NAME AS NAME, 
          THREAD_MSG.MSG AS MSG, 
          BIN_TO_UUID(THREAD_MSG.ID) AS ID_MSG 
          FROM THREAD_MSG
          JOIN USER ON USER.ID = THREAD_MSG.ID_USER
          WHERE ID_THREAD = UUID_TO_BIN(?)`,
          [id]
      )
      return rows
    } catch (e) {
      throw new DatabaseError('Error getting thread msg')
    }
  },

  createMsg: async function (userId: string, threadId: string, msg: string, connection: mysql.Connection) {
    if (userId === '' || threadId === '' || msg === '') {
      throw new UserBadRequestError('Missing data')
    }

    try {
      await connection.beginTransaction()

      await connection.query(
        'INSERT INTO THREAD_MSG (ID_THREAD, ID_USER, MSG) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?)',
        [threadId, userId, msg]
      )

      await connection.commit()

      const idMsg = await connection.query(
        'SELECT BIN_TO_UUID(ID) AS ID_MSG FROM THREAD_MSG WHERE ID_THREAD = UUID_TO_BIN(?) AND ID_USER = UUID_TO_BIN(?) AND MSG = ?',
        [threadId, userId, msg]
      )

      return (idMsg as any)[0][0]
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error creating thread')
    }
  },

  updateMsg: async function (userId: string, threadId: string, msgId: string, msg: string, connection: mysql.Connection) {
    if (userId === '' || threadId === '' || msgId === '' || msg === '') {
      throw new UserBadRequestError('Missing data')
    }
    try {
      await connection.beginTransaction()

      await connection.query(
        'UPDATE THREAD_MSG SET MSG = ? WHERE ID_THREAD = UUID_TO_BIN(?) AND ID_USER = UUID_TO_BIN(?) AND ID = UUID_TO_BIN(?)',
        [msg, threadId, userId, msgId]
      )

      await connection.commit()
      return { userId, threadId }
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error updating thread')
    }
  },

  deleteMsg: async function (userId: string, threadId: string, msgId: string, connection: mysql.Connection) {
    if (userId === '' || threadId === '' || msgId === '') {
      throw new UserBadRequestError('Missing data')
    }

    try {
      await connection.beginTransaction()

      await connection.query(
        'DELETE FROM THREAD_MSG WHERE ID_THREAD = UUID_TO_BIN(?) AND ID_USER = UUID_TO_BIN(?) AND ID = UUID_TO_BIN(?)',
        [threadId, userId, msgId]
      )

      await connection.commit()
      return { userId, threadId }
    } catch (e) {
      await connection.rollback()
      throw new DatabaseError('Error deleting thread')
    }
  }
}
