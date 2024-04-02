type TUserLoginType = {
    EMAIL_PASSWORD: string,
    GITHUB: string,
    GOOGLE: string,
}

type TUserTypes = {
    ADMIN: string,
    USER: string
}

const UserLoginType: TUserLoginType = {
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
    GOOGLE: "GOOGLE",
    GITHUB: "GITHUB"
}

const AvailableSocialLogins = Object.values(UserLoginType)

const UserRolesEnum: TUserTypes = {
    ADMIN: "ADMIN",
    USER: "USER",
};

const AvailableUserRoles = Object.values(UserRolesEnum);

export { UserLoginType, AvailableSocialLogins, AvailableUserRoles, UserRolesEnum }