import { Hono } from 'hono'
import connectToDB from './db/dbConfig'
import User from "./models/user.models"
import { UserRegisterValidatorSchema } from "./validators/user.validator"
import { zValidator } from "@hono/zod-validator"
import { UserLoginType, UserRolesEnum } from './constants'

const app = new Hono()

connectToDB()

app.post("/api/v1/user/create", zValidator('json', UserRegisterValidatorSchema), async (c) => {

  const { username, email, password, role } = c.req.valid("json")

  try {
    // find if the user does not exist already with the provided email
    const userFound = await User.findOne({ email })
    if (userFound) {
      return c.json({ "message": "please enter another email address" }, 409)
    }

    // create the user in the database
    const user = await User.create({ username, email, password, isEmailVerified: false, role: role || UserRolesEnum.USER, loginType: UserLoginType.EMAIL_PASSWORD })

    // find if the user is created in the database
    const userCreated = await User.findById(user._id).select("-password -refreshToken -loginType -role -isEmailVerified")
    if (!userCreated) {
      return c.json({ message: "Internal server error" }, 500)
    }
    return c.json({ message: "User created successfully", data: userCreated }, 201)

  } catch (error) {
    c.json(error, 500)
  }
})

export default app
