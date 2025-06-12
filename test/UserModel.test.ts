import { UserModel } from '../models/user'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

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
    userId = (response.id as any)[0].ID
    expect(response).toEqual({ name: 'John Doe', email: 'john@doe.com', password: '123456', id: expect.any(Object) })
  })

  test('Update user', async () => {
    const response = await UserModel.update(userId, { name: 'John Doe2' }, connection)
    expect(response).toEqual({ NAME: 'John Doe2' })
  })

  test('login user', async () => {
    const response = await UserModel.login(userId, 'john@doe.com', '123456', connection)
    expect(response).toEqual({ id: userId })
  })

  test('delete user', async () => {
    const response = await UserModel.delete(userId, connection)
    expect(response).toEqual({ id: userId })
  })
})
