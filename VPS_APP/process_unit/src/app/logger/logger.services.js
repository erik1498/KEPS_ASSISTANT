import { getEnv } from "../../utils/envUtils.js"
import { createLoggerRepo } from "./logger.repository.js"

export const createLoggerService = async (loggerData, req_id) => {
    if (getEnv("DEMO_TYPE") == "true") {
        return true
    } else {
        const logger = await createLoggerRepo(loggerData, req_id)
        return logger
    }
}