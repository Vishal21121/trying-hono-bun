import { Schema, model } from "mongoose"
import { AvailableSocialLogins, UserLoginType, AvailableUserRoles, UserRolesEnum } from "../constants";

interface IUserSchema {
    username: string;
    email: string;
    password: string;
    loginType: string;
    role: string;
    isEmailVerified: boolean;
    refreshToken: string;
    forgotPasswordToken: string;
    forgotPasswordExpiry: Date;
    emailVerificationToken: string;
    emailVerificationExpiry: Date;
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
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    }
}, { timestamps: true })

const User = model("User", UserSchema)
export default User