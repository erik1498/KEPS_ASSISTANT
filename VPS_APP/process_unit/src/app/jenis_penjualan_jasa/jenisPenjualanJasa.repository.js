import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JenisPenjualanJasaModel from "./jenisPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllJenisPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const jenisPenjualanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.jenis_penjualan_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : jenisPenjualanJasasCount[0].count

    const jenisPenjualanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.jenis_penjualan_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: jenisPenjualanJasas,
        count: jenisPenjualanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getJenisPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JenisPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createJenisPenjualanJasaRepo = async (jenisPenjualanJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanJasaModel,
        {
            name: jenisPenjualanJasaData.name,
            code: jenisPenjualanJasaData.code,
            enabled: jenisPenjualanJasaData.enabled
        }
    )
}

export const deleteJenisPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateJenisPenjualanJasaByUuidRepo = async (uuid, jenisPenjualanJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanJasaModel,
        {
            name: jenisPenjualanJasaData.name,
            code: jenisPenjualanJasaData.code,
        },
        {
            uuid
        }
    )
}