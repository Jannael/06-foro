import { ThreadModel } from '../models/thread'
import conectDB from '../database/connect'
import mysql from 'mysql2/promise'
import { UserModel } from '../models/user'
import zod from 'zod'

const returnSchemaCreateThread = zod.object({
  threadId: zod.string().uuid(),
  userId: zod.string(),
  name: zod.string(),
  description: zod.string()
})

describe('Thread Model', () => {
  let connection: mysql.Connection
  let userId: string
  let ThreadId: string

  beforeAll(async () => {
    connection = await conectDB()
  })

  afterAll(async () => {
    await connection.end()
  })

  describe('Thread Model Functions', () => {
    beforeAll(async () => {
      const user = await UserModel.create('createThreadUser', 'john@doe.com', '123456', connection)
      userId = user.id
    })

    afterAll(async () => {
      await UserModel.delete(userId, connection)
    })

    test('getAll thread', async () => {
      const response = await ThreadModel.getAll(connection)
      expect(response).toEqual(expect.any(Array))
    })

    test('Create thread', async () => {
      const response = await ThreadModel.create(userId, 'Thread 1', 'Description 1', connection)

      ThreadId = response.threadId

      const schemaResult = returnSchemaCreateThread.parse(response)
      expect(schemaResult).toEqual(response)
    })

    describe('Thread Model MSG Functions', () => {
      test('getAll thread msg', async () => {
        const response = await ThreadModel.getMsgById(ThreadId, connection)
        expect(response).toEqual(expect.any(Array))
      })

      let MsgId: string
      test('Create thread msg', async () => {
        const response = await ThreadModel.createMsg(userId, ThreadId, 'Message 1', connection)
        MsgId = response.ID_MSG
        expect(response).toEqual({ ID_MSG: expect.any(String) })
      })

      test('Update thread msg', async () => {
        const response = await ThreadModel.updateMsg(userId, ThreadId, MsgId, 'Message 2', connection)
        expect(response).toEqual({ userId, threadId: ThreadId })
      })

      test('Delete thread msg', async () => {
        const response = await ThreadModel.deleteMsg(userId, ThreadId, MsgId, connection)
        expect(response).toEqual({ userId, threadId: ThreadId })
      })
    })

    test('Update thread', async () => {
      const response = await ThreadModel.update(userId, ThreadId, { name: 'Thread 2' }, connection)
      expect(response).toEqual({ userId })
    })

    test('Delete thread', async () => {
      const response = await ThreadModel.delete(userId, ThreadId, connection)
      expect(response).toEqual({ userId })
    })
  })
})
