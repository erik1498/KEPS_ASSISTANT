import UserModel from "./user.model.js";

export const getUserByUsernameRepo = async (username, active, req_id) => {
    const user = await UserModel.findOne({
        where: {
            username,
            active,
            client_id: JSON.parse(req_id).client_id
        }
    })
    return user
}

export const updateUserByUUIDLoginStatus = async (uuid, active, req_id) => {
    const user = await UserModel.update({
        active
    }, {
        where: {
            uuid,
            client_id: JSON.parse(req_id).client_id
        }
    })
}

export const getUserByUuidRepo = async (uuid, req_id) => {
    const user = await UserModel.findOne({
        where: {
            uuid,
            active: true,
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