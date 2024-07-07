import LoggerModel from "./logger.model.js";
import { generateDatabaseName, insertQueryUtil } from "../../utils/databaseUtil.js";

export const createLoggerRepo = async (loggerData, req_id) => {
    return insertQueryUtil(
        generateDatabaseName(req_id),
        LoggerModel,
        {
            service: loggerData.service,
            status: loggerData.status,
            method: loggerData.method,
            data: JSON.stringify(loggerData.data),
            req_time: loggerData.req_time,
            req_id: loggerData.req_identity.id,
            req_user_id: loggerData.req_identity.userId ? loggerData.req_identity.userId : "NULL",
        }
    )
}