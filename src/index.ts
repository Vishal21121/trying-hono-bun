import { Hono } from 'hono'
import connectToDB from './db/dbConfig'

const app = new Hono()

connectToDB()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
