import { createLoggerRepo, getLoggerDataRepo } from "./logger.repository.js"

export const createLoggerService = async (loggerData) => {
    const logger = await createLoggerRepo(loggerData)
    return logger
}

export const getLoggerData = async (bulan, tahun) => {
    const logger = await getLoggerDataRepo(bulan, tahun)
    return logger;
}