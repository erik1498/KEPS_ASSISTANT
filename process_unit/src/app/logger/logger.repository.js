import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import LoggerModel from "./logger.model.js";

export const createLoggerRepo = async (loggerData) => {
    const logger = await LoggerModel.create({
        service: loggerData.service,
        status: loggerData.status,
        method: loggerData.method,
        data: JSON.stringify(loggerData.data),
        req_time: loggerData.req_time,
        req_id: loggerData.req_identity.id,
        req_user_id: loggerData.req_identity.userId ? loggerData.req_identity.userId : "NULL",
        client_id: loggerData.client_id
    })
    return logger
}

export const getLoggerDataRepo = async (bulan, tahun, req_id) => {
    
    const maxTanggal = bulan < 12 ? `${tahun}-${parseInt(bulan) + 1}-01` : `${parseInt(tahun) + 1}-01-01`
    
    bulan = parseInt(bulan) < 10 ? `0${bulan}` : bulan

    const logger = await db.query(
        `
            SELECT 
                lt.* 
            FROM logger_tab lt 
            WHERE lt.createdAt >= "${tahun}-${bulan}-01" AND lt.createdAt < "${maxTanggal}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return logger;
}