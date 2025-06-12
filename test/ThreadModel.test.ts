import { ThreadModel } from '../models/thread'
import conectDB from '../database/connect'
import mysql from 'mysql2/promise'
import { UserModel } from '../models/user'
import zod from 'zod'

const returnSchemaCreateThread = zod.object({
  threadId: zod.object(
    { ID: zod.string().uuid() }
  ),
  userId: zod.string(),
  name: zod.string(),
  description: zod.string()
})

describe('Thread Model', () => {
  let connection: mysql.Connection
  beforeAll(async () => {
    connection = await conectDB()
  })

  afterAll(async () => {
    await connection.end()
  })

  describe('Thread Model Functions', () => {
    test('getAll thread', async () => {
      const response = await ThreadModel.getAll(connection)
      expect(response).toEqual(expect.any(Array))
    })

    test('Create thread', async () => {
      const userId = await UserModel.create('createThreadUser', 'john@doe.com', '123456', connection)
      const response = await ThreadModel.create((userId.id as any)[0].ID, 'Thread 1', 'Description 1', connection)

      await ThreadModel.delete((userId.id as any)[0].ID, response.threadId.ID, connection)
      await UserModel.delete((userId.id as any)[0].ID, connection)

      const schemaResult = returnSchemaCreateThread.parse(response)
      expect(schemaResult).toEqual(response)
    })

    test('Update thread', async () => {})
    test('Delete thread', async () => {})
  })

  describe('Thread Model MSG Functions', () => {
    test('getAll thread msg', async () => {})
    test('Create thread msg', async () => {})
    test('Update thread msg', async () => {})
    test('Delete thread msg', async () => {})
  })
})
