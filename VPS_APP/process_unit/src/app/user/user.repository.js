import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import UserModel from "./user.model.js";

export const getUserByUsernameRepo = async (username, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        UserModel,
        null,
        {
            username
        }
    )
}

export const getUserByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        UserModel,
        null,
        {
            uuid
        }
    )
}


export const createUserRepo = async (userData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        UserModel,
        {
            username: userData.username,
            password: userData.password,
            name: userData.name,
            role: userData.role
        }
    )
}

export const incrementJumlahUserEntryDataRepo = async (userData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        UserModel,
        {
            jumlah_entry_data: userData.userJumlahEntryData + 1,
        },
        {
            uuid: userData.userId
        }
    )
}