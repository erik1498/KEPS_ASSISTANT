import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriBahanBakuModel from "./kategoriBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKategoriBahanBakuRepo = async (pageNumber, size, search, req_id) => {
    const kategoriBahanBakusCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kategori_bahan_baku_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriBahanBakusCount[0].count

    const kategoriBahanBakus = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.kategori_bahan_baku_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriBahanBakus,
        count: kategoriBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKategoriBahanBakuRepo = async (kategoriBahanBakuData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriBahanBakuModel,
        {   
        name: kategoriBahanBakuData.name,
            enabled: kategoriBahanBakuData.enabled
        }
    )
}

export const deleteKategoriBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriBahanBakuByUuidRepo = async (uuid, kategoriBahanBakuData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriBahanBakuModel,
        {
        name: kategoriBahanBakuData.name,
        },
        {
            uuid
        }
    )
}

export const checkKategoriBahanBakuAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                dbt.* 
            FROM ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt 
            WHERE dbt.kategori_bahan_baku = "${uuid}" 
            AND dbt.enabled = 1 
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}