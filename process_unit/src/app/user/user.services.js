import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { createUserRepo, getUserByUsernameRepo, getUserByUuidRepo, updateUserByUUIDLoginStatus } from "./user.repository.js"

export const getUserByUsername = async (username, active, req_id) => {
    LOGGER(logType.INFO, `Start getUserByUsername`, { username, active }, req_id)
    const user = await getUserByUsernameRepo(username, active, req_id)

    if (!user) {
        throw Error(JSON.stringify({
            message: "Akun Tidak Terdaftar",
            field: "password"
        }))
    }
    return user
}

export const getUserByUuid = async (data, req_id) => {
    LOGGER(logType.INFO, `Start getUserByUuid`, data, req_id)
    const user = await getUserByUuidRepo(data.uuid, req_id)

    if (!user) {
        throw Error("Authentication Failed")
    }
    return user
}


export const createUserService = async (userData, req_id) => {
    LOGGER(logType.INFO, `Start createUserService`, userData, req_id)
    const user = await createUserRepo(userData, req_id)
    return user
}

export const updateUserActiveService = async (uuid, active, req_id) => {
    LOGGER(logType.INFO, `Start updateUserActiveService`, uuid, req_id)
    await updateUserByUUIDLoginStatus(uuid, active, req_id);
}