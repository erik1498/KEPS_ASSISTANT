import UserModel from "./user.model.js";

export const getUserByUsernameRepo = async (username, active) => {
    const user = await UserModel.findOne({
        where: {
            username,
            // active
        }
    })
    return user
}

export const updateUserByUUIDLoginStatus = async (uuid) => {
    const user = await UserModel.update({
        active: true
    }, {
        where: {
            uuid
        }
    })
}

export const getUserByUuidRepo = async (uuid) => {
    const user = await UserModel.findOne({
        where: {
            uuid
        }
    })
    return user
}


export const createUserRepo = async (userData) => {
    const user = await UserModel.create({
        username: userData.username,
        password: userData.password,
        name: userData.name,
        role: userData.role,
    })
    return user
}