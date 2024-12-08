import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JenisBahanBakuModel from "./jenisBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllJenisBahanBakuRepo = async (pageNumber, size, search, req_id) => {
    const jenisBahanBakusCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.jenis_bahan_baku_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : jenisBahanBakusCount[0].count

    const jenisBahanBakus = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.jenis_bahan_baku_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: jenisBahanBakus,
        count: jenisBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getJenisBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JenisBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createJenisBahanBakuRepo = async (jenisBahanBakuData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisBahanBakuModel,
        {   
        name: jenisBahanBakuData.name,
        code: jenisBahanBakuData.code,
            enabled: jenisBahanBakuData.enabled
        }
    )
}

export const deleteJenisBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateJenisBahanBakuByUuidRepo = async (uuid, jenisBahanBakuData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisBahanBakuModel,
        {
        name: jenisBahanBakuData.name,
        code: jenisBahanBakuData.code,
        },
        {
            uuid
        }
    )
}

export const checkJenisBahanBakuAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                dbt.* 
            FROM ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt 
            WHERE dbt.jenis_bahan_baku = "${uuid}" 
            AND dbt.enabled = 1 
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}