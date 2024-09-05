import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarBarangModel from "./daftarBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllDaftarBarangRepo = async (pageNumber, size, search, req_id) => {
    const daftarBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.daftar_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarBarangsCount[0].count

    const daftarBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.daftar_barang_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
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