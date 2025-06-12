import mysql from 'mysql2/promise'

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
  }

  
}
