import { UserModel } from '../models/user'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import {
  UserBadRequestError,
  MissingDataError,
  DuplicateEntryError
} from '../errors/errors'
dotenv.config()

describe('User Model', () => {
  let connection: mysql.Connection
  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME
    })
  })

  afterAll(async () => {
    await connection.end()
  })

  let userId: string

  test('Create user', async () => {
    const response = await UserModel.create('John Doe', 'john@doe.com', '123456', connection)

    userId = response.id

    expect(response).toEqual({ name: 'John Doe', email: 'john@doe.com', password: '123456', id: expect.any(String) })
  })

  test('Update user', async () => {
    const response = await UserModel.update(userId, { name: 'John Doe2' }, connection)
    expect(response).toEqual({ id: userId })
  })

  describe('user Model Bad Requests', () => {
    test('create user', async () => {
      await expect(UserModel.create('', 'john@doe.com', '123456', connection))
        .rejects.toThrow(new MissingDataError('Missing data'))

      await expect(UserModel.create('John Doe2', 'john@Doe.com', '123456', connection)) // duplicate entry
        .rejects.toThrow(new DuplicateEntryError('Duplicate entry'))
    })

    test('Update User', async () => {
      await expect(UserModel.update(userId, {}, connection))
        .rejects.toThrow(new MissingDataError('Missing data'))

      await expect(UserModel.update('', { name: 'John Doe2' }, connection))
        .rejects.toThrow(new MissingDataError('Missing data'))
    })

    test('Delete User', async () => {
      await expect(UserModel.delete('', connection))
        .rejects.toThrow(new MissingDataError('Missing data'))
    })

    test('Login User', async () => {
      await expect(UserModel.login('', '123456', connection))
        .rejects.toThrow(new MissingDataError('Missing data'))

      await expect(UserModel.login('John Doe2', '', connection))
        .rejects.toThrow(new MissingDataError('Missing data'))

      await expect(UserModel.login('John Doe2', '12346', connection))
        .rejects.toThrow(new UserBadRequestError('Invalid password'))
    })
  })

  test('login user', async () => {
    const response = await UserModel.login('John Doe2', '123456', connection)
    // const badResponse = await UserModel.login('John Doe2', '12356', connection)
    expect(response).toEqual({ name: 'John Doe2' })
    // expect(badResponse).toThrow(new UserBadRequestError('Invalid password'))
  })

  test('delete user', async () => {
    const response = await UserModel.delete(userId, connection)
    expect(response).toEqual({ id: userId })
  })
})
