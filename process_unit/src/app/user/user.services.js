import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getUserByUsernameRepo, getUserByUuidRepo } from "./user.repository.js"

export const getUserByUsername = async(data, req_id) => {
    LOGGER(logType.INFO, `Start getUserByUsername`, data, req_id)
    const user = await getUserByUsernameRepo(data.username)

    if (!user) {
        throw Error(JSON.stringify({
            message: "Akun Tidak Terdaftar",
            field: "username"
        }))
    }
    return user
}

export const getUserByUuid = async(data, req_id) => {
    LOGGER(logType.INFO, `Start getUserByUuid`, data, req_id)
    const user = await getUserByUuidRepo(data.uuid)

    if (!user) {
        throw Error("Authentication Failed")
    }
    return user
}