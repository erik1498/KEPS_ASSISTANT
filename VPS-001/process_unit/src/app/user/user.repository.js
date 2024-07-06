import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil } from "../../utils/databaseUtil.js";
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
        generateDatabaseName(req_id),
        UserModel,
        {
            username: userData.username,
            password: userData.password,
            name: userData.name,
            role: userData.role,
            client_id: JSON.parse(req_id).client_id
        }
    )
}