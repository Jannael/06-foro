import { Connection } from 'mysql2/promise'
import { Request } from 'express'

export interface CustomRequest extends Request {
  connectionDB: Connection
  UserId: string
}
