import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JenisPenjualanBahanBakuModel from "./jenisPenjualanBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllJenisPenjualanBahanBakuRepo = async (pageNumber, size, search, req_id) => {
    const jenisPenjualanBahanBakusCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.jenis_penjualan_bahan_baku_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : jenisPenjualanBahanBakusCount[0].count

    const jenisPenjualanBahanBakus = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.jenis_penjualan_bahan_baku_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: jenisPenjualanBahanBakus,
        count: jenisPenjualanBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getJenisPenjualanBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JenisPenjualanBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createJenisPenjualanBahanBakuRepo = async (jenisPenjualanBahanBakuData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanBahanBakuModel,
        {   
        name: jenisPenjualanBahanBakuData.name,
        code: jenisPenjualanBahanBakuData.code,
            enabled: jenisPenjualanBahanBakuData.enabled
        }
    )
}

export const deleteJenisPenjualanBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateJenisPenjualanBahanBakuByUuidRepo = async (uuid, jenisPenjualanBahanBakuData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JenisPenjualanBahanBakuModel,
        {
        name: jenisPenjualanBahanBakuData.name,
        code: jenisPenjualanBahanBakuData.code,
        },
        {
            uuid
        }
    )
}

export const checkJenisPenjualanBahanBakuAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                dbt.* 
            FROM ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt 
            WHERE dbt.jenis_penjualan_bahan_baku = "${uuid}" 
            AND dbt.enabled = 1 
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}