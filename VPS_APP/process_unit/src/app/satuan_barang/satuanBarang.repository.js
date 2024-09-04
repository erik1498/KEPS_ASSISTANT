import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import SatuanBarangModel from "./satuanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllSatuanBarangRepo = async (pageNumber, size, search, req_id) => {
    const satuanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.satuan_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : satuanBarangsCount[0].count

    const satuanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.satuan_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: satuanBarangs,
        count: satuanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getSatuanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        SatuanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createSatuanBarangRepo = async (satuanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanBarangModel,
        {   
        name: satuanBarangData.name,
            enabled: satuanBarangData.enabled
        }
    )
}

export const deleteSatuanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateSatuanBarangByUuidRepo = async (uuid, satuanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanBarangModel,
        {
        name: satuanBarangData.name,
        },
        {
            uuid
        }
    )
}