import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JenisGudangModel from "./jenisGudang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllJenisGudangRepo = async (pageNumber, size, search, req_id) => {
    const jenisGudangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.jenis_gudang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : jenisGudangsCount[0].count

    const jenisGudangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.jenis_gudang_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: jenisGudangs,
        count: jenisGudangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getJenisGudangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JenisGudangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createJenisGudangRepo = async (jenisGudangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisGudangModel,
        {   
        name: jenisGudangData.name,
        code: jenisGudangData.code,
            enabled: jenisGudangData.enabled
        }
    )
}

export const deleteJenisGudangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisGudangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateJenisGudangByUuidRepo = async (uuid, jenisGudangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisGudangModel,
        {
        name: jenisGudangData.name,
        code: jenisGudangData.code,
        },
        {
            uuid
        }
    )
}

export const checkJenisGudangSudahDigunakanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt
            WHERE dgt.jenis_gudang = "${uuid}"
            AND dgt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}