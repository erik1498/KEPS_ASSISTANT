import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JenisJasaModel from "./jenisJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllJenisJasaRepo = async (pageNumber, size, search, req_id) => {
    const jenisJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.jenis_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : jenisJasasCount[0].count

    const jenisJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.jenis_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: jenisJasas,
        count: jenisJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getJenisJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JenisJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createJenisJasaRepo = async (jenisJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisJasaModel,
        {   
        name: jenisJasaData.name,
        code: jenisJasaData.code,
            enabled: jenisJasaData.enabled
        }
    )
}

export const deleteJenisJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateJenisJasaByUuidRepo = async (uuid, jenisJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisJasaModel,
        {
        name: jenisJasaData.name,
        code: jenisJasaData.code,
        },
        {
            uuid
        }
    )
}

export const checkJenisJasaAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                dbt.* 
            FROM ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt 
            WHERE dbt.jenis_jasa = "${uuid}" 
            AND dbt.enabled = 1 
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}