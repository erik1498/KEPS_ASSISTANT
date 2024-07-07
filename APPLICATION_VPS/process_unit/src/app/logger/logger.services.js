import { createLoggerRepo } from "./logger.repository.js"

export const createLoggerService = async (loggerData, req_id) => {
    const logger = await createLoggerRepo(loggerData, req_id)
    return logger
}