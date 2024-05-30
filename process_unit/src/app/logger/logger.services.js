import { createLoggerRepo, getLoggerDataRepo } from "./logger.repository.js"

export const createLoggerService = async (loggerData, req_id) => {
    const logger = await createLoggerRepo(loggerData, req_id)
    return logger
}

export const getLoggerData = async (bulan, tahun) => {
    const logger = await getLoggerDataRepo(bulan, tahun)
    return logger;
}