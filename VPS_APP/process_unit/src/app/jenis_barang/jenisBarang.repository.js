import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JenisBarangModel from "./jenisBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllJenisBarangRepo = async (pageNumber, size, search, req_id) => {
    const jenisBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.jenis_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : jenisBarangsCount[0].count

    const jenisBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.jenis_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: jenisBarangs,
        count: jenisBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getJenisBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JenisBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createJenisBarangRepo = async (jenisBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisBarangModel,
        {   
        name: jenisBarangData.name,
        code: jenisBarangData.code,
            enabled: jenisBarangData.enabled
        }
    )
}

export const deleteJenisBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateJenisBarangByUuidRepo = async (uuid, jenisBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisBarangModel,
        {
        name: jenisBarangData.name,
        code: jenisBarangData.code,
        },
        {
            uuid
        }
    )
}

export const checkJenisBarangAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                dbt.* 
            FROM ${generateDatabaseName(req_id)}.daftar_barang_tab dbt 
            WHERE dbt.jenis_barang = "${uuid}" 
            AND dbt.enabled = 1 
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}