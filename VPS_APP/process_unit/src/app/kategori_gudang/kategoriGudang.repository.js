import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriGudangModel from "./kategoriGudang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKategoriGudangRepo = async (pageNumber, size, search, req_id) => {
    const kategoriGudangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kategori_gudang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriGudangsCount[0].count

    const kategoriGudangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.kategori_gudang_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriGudangs,
        count: kategoriGudangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriGudangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriGudangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKategoriGudangRepo = async (kategoriGudangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriGudangModel,
        {   
        name: kategoriGudangData.name,
            enabled: kategoriGudangData.enabled
        }
    )
}

export const deleteKategoriGudangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriGudangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriGudangByUuidRepo = async (uuid, kategoriGudangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriGudangModel,
        {
        name: kategoriGudangData.name,
        },
        {
            uuid
        }
    )
}