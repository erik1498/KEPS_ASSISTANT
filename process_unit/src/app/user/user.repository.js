import UserModel from "./user.model.js";

export const getUserByUsernameRepo = async (username) => {
    const user = await UserModel.findOne({
        where:{
            username
        }
    })
    return user
}

export const getUserByUuidRepo = async (uuid) => {
    const user = await UserModel.findOne({
        where:{
            uuid
        }
    })
    return user
}