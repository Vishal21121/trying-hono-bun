import { Hono } from 'hono'
import connectToDB from './db/dbConfig'
import User from "./models/user.models"

const app = new Hono()

connectToDB()

app.post("/api/v1/user/create", async (c) => {
  const { username, email, password } = await c.req.json()
  const userFound = await User.findOne({ email })
  if (userFound) {
    return c.json({ "message": "please enter another email address" }, 400)
  }
})

export default app
