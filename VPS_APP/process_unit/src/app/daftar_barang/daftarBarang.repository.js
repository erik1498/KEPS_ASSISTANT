import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarBarangModel from "./daftarBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllDaftarBarangRepo = async (pageNumber, size, search, req_id) => {
    const daftarBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_barang_tab dbt 
            JOIN ${generateDatabaseName(req_id)}.kategori_barang_tab kbt ON kbt.uuid = dbt.kategori_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_penjualan_barang_tab jpbt ON jpbt.uuid = dbt.jenis_penjualan_barang 
            WHERE dbt.name LIKE '%${search}%' 
            AND dbt.enabled = 1
            AND kbt.enabled = 1
            AND jbt.enabled = 1
            AND jpbt.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarBarangsCount[0].count

    const daftarBarangs = await db.query(
        `
            SELECT 
                dbt.*,
                kbt.name AS kategori_barang_name,
                jbt.name AS jenis_barang_name,
                jpbt.name AS jenis_penjualan_barang_name
            FROM ${generateDatabaseName(req_id)}.daftar_barang_tab dbt 
            JOIN ${generateDatabaseName(req_id)}.kategori_barang_tab kbt ON kbt.uuid = dbt.kategori_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_penjualan_barang_tab jpbt ON jpbt.uuid = dbt.jenis_penjualan_barang 
            WHERE dbt.name LIKE '%${search}%' 
            AND dbt.enabled = 1
            AND kbt.enabled = 1
            AND jbt.enabled = 1
            AND jpbt.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: daftarBarangs,
        count: daftarBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDaftarBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DaftarBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDaftarBarangRepo = async (daftarBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBarangModel,
        {   
        name: daftarBarangData.name,
        kategori_barang: daftarBarangData.kategori_barang,
        jenis_barang: daftarBarangData.jenis_barang,
        jenis_penjualan_barang: daftarBarangData.jenis_penjualan_barang,
        ppn: daftarBarangData.ppn,
        status: daftarBarangData.status,
            enabled: daftarBarangData.enabled
        }
    )
}

export const deleteDaftarBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDaftarBarangByUuidRepo = async (uuid, daftarBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBarangModel,
        {
        name: daftarBarangData.name,
        kategori_barang: daftarBarangData.kategori_barang,
        jenis_barang: daftarBarangData.jenis_barang,
        jenis_penjualan_barang: daftarBarangData.jenis_penjualan_barang,
        ppn: daftarBarangData.ppn,
        status: daftarBarangData.status,
        },
        {
            uuid
        }
    )
}