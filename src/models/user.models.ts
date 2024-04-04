import { Schema, model } from "mongoose"
import { AvailableSocialLogins, UserLoginType, AvailableUserRoles, UserRolesEnum } from "../constants";
import { hash, compare } from "bcrypt"
import { sign } from "jsonwebtoken"

interface IUserSchema {
    username: string;
    email: string;
    password: string;
    loginType: string;
    role: string;
    isEmailVerified: boolean;
    refreshToken: string;
    isPasswordCorrect: (password: string) => Promise<boolean>;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
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

UserSchema.methods.generateAccessToken = function () {
    return sign(
        {
            _id: this._id,
            email: this.email,
            password: this.password
        },
        String(process.env.ACCESS_TOKEN_SECRET),
        {
            expiresIn: String(process.env.ACCESS_TOKEN_EXPIRY)
        }
    )
}

UserSchema.methods.generateRefreshToken = function () {
    return sign(
        {
            _id: this._id,
        },
        String(process.env.REFRESH_TOKEN_SECRET),
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = model("User", UserSchema)
export default User