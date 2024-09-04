import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JabatanModel from "./jabatan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllJabatanRepo = async (pageNumber, size, search, req_id) => {
    const jabatansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.jabatan_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : jabatansCount[0].count

    const jabatans = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.jabatan_tab WHERE name LIKE '%${search}%'  AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: jabatans,
        count: jabatansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getJabatanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JabatanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createJabatanRepo = async (jabatanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JabatanModel,
        {
            name: jabatanData.name,
            enabled: jabatanData.enabled
        }
    )
}

export const deleteJabatanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JabatanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateJabatanByUuidRepo = async (uuid, jabatanData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JabatanModel,
        {
            name: jabatanData.name,
        },
        {
            uuid
        }
    )
}