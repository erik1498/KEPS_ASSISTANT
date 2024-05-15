import UserModel from "./user.model.js";

export const getUserByUsernameRepo = async (username, req_id) => {
    const user = await UserModel.findOne({
        where: {
            username,
            client_id: JSON.parse(req_id).client_id
        }
    })
    return user
}

export const getUserByUuidRepo = async (uuid, req_id) => {
    const user = await UserModel.findOne({
        where: {
            uuid,
            client_id: JSON.parse(req_id).client_id
        }
    })
    return user
}


export const createUserRepo = async (userData, req_id) => {
    const user = await UserModel.create({
        username: userData.username,
        password: userData.password,
        name: userData.name,
        role: userData.role,
        client_id: JSON.parse(req_id).client_id
    })
    return user
}