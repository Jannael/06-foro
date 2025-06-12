import express from 'express'
import { UserRouter } from './Routes/user'
import { ThreadRouter } from './Routes/thread'

export const app = express()

app.use(express.json())

app.use('/api/user', UserRouter)
app.use('/api/thread', ThreadRouter)

export const server = app.listen(3000, () => {})
