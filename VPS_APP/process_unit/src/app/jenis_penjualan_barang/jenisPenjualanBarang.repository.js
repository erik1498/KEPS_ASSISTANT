import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JenisPenjualanBarangModel from "./jenisPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllJenisPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const jenisPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.jenis_penjualan_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : jenisPenjualanBarangsCount[0].count

    const jenisPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.jenis_penjualan_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: jenisPenjualanBarangs,
        count: jenisPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getJenisPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JenisPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createJenisPenjualanBarangRepo = async (jenisPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanBarangModel,
        {   
        name: jenisPenjualanBarangData.name,
        code: jenisPenjualanBarangData.code,
            enabled: jenisPenjualanBarangData.enabled
        }
    )
}

export const deleteJenisPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateJenisPenjualanBarangByUuidRepo = async (uuid, jenisPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanBarangModel,
        {
        name: jenisPenjualanBarangData.name,
        code: jenisPenjualanBarangData.code,
        },
        {
            uuid
        }
    )
}