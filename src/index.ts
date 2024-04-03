import { Hono } from 'hono'
import connectToDB from './db/dbConfig'
import User from "./models/user.models"
import { UserRegisterValidatorSchema } from "./validators/user.validator"
import { zValidator } from "@hono/zod-validator"

const app = new Hono()

connectToDB()

app.post("/api/v1/user/create", zValidator('json', UserRegisterValidatorSchema), async (c) => {
  const { username, email, password } = c.req.valid("json")
  // find if the user does not exist already with the provided email
  const userFound = await User.findOne({ email })
  if (userFound) {
    return c.json({ "message": "please enter another email address" }, 400)
  }
  // hash the password
  // generate the ref and act tokens
  // create the user in the database
  // find if the user is created in the database
  // pass ref and act tokens to the user
  return c.json(200)
})

export default app
