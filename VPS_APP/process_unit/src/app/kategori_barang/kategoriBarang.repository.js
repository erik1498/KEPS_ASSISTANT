import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriBarangModel from "./kategoriBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKategoriBarangRepo = async (pageNumber, size, search, req_id) => {
    const kategoriBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kategori_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriBarangsCount[0].count

    const kategoriBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.kategori_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriBarangs,
        count: kategoriBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKategoriBarangRepo = async (kategoriBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriBarangModel,
        {   
        name: kategoriBarangData.name,
            enabled: kategoriBarangData.enabled
        }
    )
}

export const deleteKategoriBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriBarangByUuidRepo = async (uuid, kategoriBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriBarangModel,
        {
        name: kategoriBarangData.name,
        },
        {
            uuid
        }
    )
}

export const checkKategoriBarangAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                dbt.* 
            FROM ${generateDatabaseName(req_id)}.daftar_barang_tab dbt 
            WHERE dbt.kategori_barang = "${uuid}" 
            AND dbt.enabled = 1 
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}