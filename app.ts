import express from 'express'
import { UserRouter } from './Routes/user'
import { ThreadRouter } from './Routes/thread'
import { ThreadMsgRouter } from './Routes/threadMsg'
import cookieParser from 'cookie-parser'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import typeDefs from './graphQL/schemas/merge'
import resolvers from './graphQL/resolvers/merge'

export async function createApp (): Promise<express.Express> {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())

  app.use('/api/user', UserRouter)
  app.use('/api/thread', ThreadRouter)
  app.use('/api/threadMsg', ThreadMsgRouter)

  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start()

  app.use('/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return { req, res }
      }
    })
  )

  app.all(/ */g, (req, res) => {
    res.status(404).send('Not found')
  })

  return app
}
