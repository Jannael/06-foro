import { ThreadModel } from '../../models/thread'
import { connection } from '../../database/connect'
import { UserModel } from '../../models/user'
import zod from 'zod'
import { ThreadMsgModel } from '../../models/threadMsg'

const returnSchemaCreateThread = zod.object({
  threadId: zod.string().uuid(),
  userId: zod.string(),
  name: zod.string(),
  description: zod.string()
})

describe('Thread and ThreadMsg Model', () => {
  let userId: string
  let ThreadId: string

  beforeAll(async () => {
  })

  afterAll(async () => {
    await (await connection).end()
  })

  describe('Thread Model Functions', () => {
    beforeAll(async () => {
      const user = await UserModel.create('createThreadUser', 'john@doe.com', '123456', await connection)
      userId = user.id
    })

    afterAll(async () => {
      await UserModel.delete(userId, await connection)
    })

    test('getAll thread', async () => {
      const response = await ThreadModel.getAll(await connection)
      expect(response).toEqual(expect.any(Array))
    })

    test('Create thread', async () => {
      const response = await ThreadModel.create(userId, 'Thread 1', 'Description 1', await connection)

      ThreadId = response.threadId

      const schemaResult = returnSchemaCreateThread.parse(response)
      expect(schemaResult).toEqual(response)
    })

    describe('ThreadMsgModel functions', () => {
      test('getAll thread msg', async () => {
        const response = await ThreadMsgModel.getMsgById(ThreadId, await connection)
        expect(response).toEqual(expect.any(Array))
      })

      let MsgId: string
      test('Create thread msg', async () => {
        const response = await ThreadMsgModel.createMsg(userId, ThreadId, 'Message 1', await connection)
        MsgId = response.ID_MSG
        expect(response).toEqual({ ID_MSG: expect.any(String) })
      })

      test('Update thread msg', async () => {
        const response = await ThreadMsgModel.updateMsg(userId, ThreadId, MsgId, 'Message 2', await connection)
        expect(response).toEqual({ userId, threadId: ThreadId })
      })

      test('Delete thread msg', async () => {
        const response = await ThreadMsgModel.deleteMsg(userId, ThreadId, MsgId, await connection)
        expect(response).toEqual({ userId, threadId: ThreadId })
      })
    })

    test('Update thread', async () => {
      const response = await ThreadModel.update(userId, ThreadId, { name: 'Thread 2' }, await connection)
      expect(response).toEqual({ userId })
    })

    test('Delete thread', async () => {
      const response = await ThreadModel.delete(userId, ThreadId, await connection)
      expect(response).toEqual({ userId })
    })
  })
})
