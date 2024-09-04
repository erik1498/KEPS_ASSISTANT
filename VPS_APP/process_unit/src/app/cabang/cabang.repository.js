import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import CabangModel from "./cabang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllCabangRepo = async (pageNumber, size, search, req_id) => {
    const cabangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.cabang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : cabangsCount[0].count

    const cabangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.cabang_tab ct
            WHERE ct.name LIKE '%${search}%' 
            AND ct.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: cabangs,
        count: cabangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getCabangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        CabangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createCabangRepo = async (cabangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        CabangModel,
        {
            name: cabangData.name,
            enabled: cabangData.enabled
        }
    )
}

export const deleteCabangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        CabangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateCabangByUuidRepo = async (uuid, cabangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        CabangModel,
        {
            name: cabangData.name
        },
        {
            uuid
        }
    )
}