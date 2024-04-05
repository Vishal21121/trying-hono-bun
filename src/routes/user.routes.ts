import { Hono } from "hono";
import User from "../models/user.models"
import { UserLoginValidatorSchema, UserRegisterValidatorSchema } from "../validators/user.validator"
import { zValidator } from "@hono/zod-validator"
import { UserLoginType, UserRolesEnum } from '../constants'
import { setCookie } from 'hono/cookie'
import mongoose from 'mongoose'

const app = new Hono()

const generateAccessAndRefreshTokens = async function (userId: mongoose.Types.ObjectId) {
    try {
        const user = await User.findById(userId)
        // generate tokens
        const accessToken = user?.generateAccessToken()
        const refreshToken = user?.generateRefreshToken()
        if (user) {
            user.refreshToken = String(refreshToken)
            await user?.save({ validateBeforeSave: false })
        }
        return { accessToken, refreshToken }
    } catch (error) {
        console.log("error", error)
    }
}


app.post("/create", zValidator('json', UserRegisterValidatorSchema), async (c) => {

    const { username, email, password, role } = c.req.valid("json")

    try {
        // find if the user does not exist already with the provided email
        const userFound = await User.findOne({ $or: [{ username }, { email }] })
        if (userFound) {
            return c.json({ "message": "User with this username or email already exists" }, 409)
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

app.post("/login", zValidator('json', UserLoginValidatorSchema), async (c) => {
    const { email, password } = c.req.valid("json")
    try {
        const userFound = await User.findOne({ email })
        if (!userFound) {
            return c.json({ message: "Please provide correct credentials" }, 401)
        }

        const isPasswordFoundCorrect = await userFound.isPasswordCorrect(password)
        if (!isPasswordFoundCorrect) {
            return c.json({ message: "Please provide correct credentials" }, 401)
        }

        // generate ref and act token and update the ref token field
        const data = await generateAccessAndRefreshTokens(userFound._id)
        let accessToken, refreshToken
        if (data) {
            accessToken = data.accessToken
            refreshToken = data.refreshToken
        }
        const loggedInUser = await User.findById(userFound._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        );

        setCookie(c, "refreshToken", String(refreshToken), {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 2 * 24 * 60 * 60
        })
        return c.json({
            status: "success",
            data: {
                message: "User logged in successfully",
                accessToken,
                loggedInUser
            }
        }, 200)

    } catch (error) {
        console.log(error)
        return c.json(error, 500)
    }
})

export default app