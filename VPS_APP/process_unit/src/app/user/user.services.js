import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { createUserRepo, getUserByUsernameRepo, getUserByUuidRepo } from "./user.repository.js"

export const getUserByUsername = async (username, req_id) => {
    LOGGER(logType.INFO, `Start getUserByUsername`, { username }, req_id)
    const user = await getUserByUsernameRepo(username, req_id)

    if (!user) {
        throw Error(JSON.stringify({
            message: "Akun Tidak Terdaftar",
            prop: "password"
        }))
    }
    return user
}

export const getUserByUuid = async (data, req_id) => {
    LOGGER(logType.INFO, `Start getUserByUuid`, data, req_id)
    const user = await getUserByUuidRepo(data.uuid, req_id)

    if (!user) {
        throw Error(JSON.stringify({
            message: "Akun Tidak Terdaftar",
            prop: "password"
        }))
    }
    return user
}


export const createUserService = async (userData, req_id) => {
    LOGGER(logType.INFO, `Start createUserService`, userData, req_id)
    const user = await createUserRepo(userData, req_id)
    return user
}