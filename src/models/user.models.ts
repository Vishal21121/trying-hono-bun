import { Schema, model } from "mongoose"
import { AvailableSocialLogins, UserLoginType, AvailableUserRoles, UserRolesEnum } from "../constants";
import { hash, compare } from "bcrypt"

interface IUserSchema {
    username: string;
    email: string;
    password: string;
    loginType: string;
    role: string;
    isEmailVerified: boolean;
    refreshToken: string;
}

const UserSchema = new Schema<IUserSchema>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    loginType: {
        type: String,
        enum: AvailableSocialLogins,
        default: UserLoginType.EMAIL_PASSWORD,
    },
    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRolesEnum.USER,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    // Hash the password
    this.password = await hash(this.password, 10);
})

UserSchema.methods.isPasswordCorrect = async function (password: string) {
    return await compare(password, this.password)
}

const User = model("User", UserSchema)
export default User