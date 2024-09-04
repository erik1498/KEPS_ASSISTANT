import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StatusTanggunganModel from "./statusTanggungan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllStatusTanggunganRepo = async (pageNumber, size, search, req_id) => {
    const statusTanggungansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.status_tanggungan_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : statusTanggungansCount[0].count

    const statusTanggungans = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.status_tanggungan_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: statusTanggungans,
        count: statusTanggungansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getStatusTanggunganByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        StatusTanggunganModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createStatusTanggunganRepo = async (statusTanggunganData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StatusTanggunganModel,
        {   
        name: statusTanggunganData.name,
            enabled: statusTanggunganData.enabled
        }
    )
}

export const deleteStatusTanggunganByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StatusTanggunganModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateStatusTanggunganByUuidRepo = async (uuid, statusTanggunganData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StatusTanggunganModel,
        {
        name: statusTanggunganData.name,
        },
        {
            uuid
        }
    )
}