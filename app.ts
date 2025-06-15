import express from 'express'
import { UserRouter } from './Routes/user'
import { ThreadRouter } from './Routes/thread'
import { ThreadMsgRouter } from './Routes/threadMsg'
import cookieParser from 'cookie-parser'

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/user', UserRouter)
app.use('/api/thread', ThreadRouter)
app.use('/api/threadMsg', ThreadMsgRouter)

export const server = app.listen(3000, () => {})
