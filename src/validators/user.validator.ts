import { z } from 'zod'
import { AvailableUserRoles } from '../constants'

const UserRegisterValidatorSchema = z.object({
    username: z.
        string({ required_error: "Username is required", invalid_type_error: "Username must be string" })
        .trim()
        .min(3, "Username must of atleast 3 characters"),
    email: z
        .string({ required_error: "Please Provide an email id" })
        .trim()
        .email({ message: "Please provide an valid email id" }),
    password: z
        .string({ required_error: "Please provide a password" })
        .trim()
        .min(8, "Password must be of atlast 8 characters"),
    role: z.string().refine(role => AvailableUserRoles.includes(role), {
        message: 'Invalid user role',
    }).optional(),

})

const UserLoginValidatorSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Please provide a valid email id"),
    password: z
        .string({ required_error: "Please provide password" })
        .trim()
})

export { UserRegisterValidatorSchema, UserLoginValidatorSchema }