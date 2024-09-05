import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarJasaModel from "./daftarJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllDaftarJasaRepo = async (pageNumber, size, search, req_id) => {
    const daftarJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.daftar_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarJasasCount[0].count

    const daftarJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.daftar_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: daftarJasas,
        count: daftarJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDaftarJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DaftarJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDaftarJasaRepo = async (daftarJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarJasaModel,
        {   
        name: daftarJasaData.name,
        kategori_jasa: daftarJasaData.kategori_jasa,
        jenis_jasa: daftarJasaData.jenis_jasa,
        jenis_penjualan_jasa: daftarJasaData.jenis_penjualan_jasa,
        ppn: daftarJasaData.ppn,
        status: daftarJasaData.status,
            enabled: daftarJasaData.enabled
        }
    )
}

export const deleteDaftarJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDaftarJasaByUuidRepo = async (uuid, daftarJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarJasaModel,
        {
        name: daftarJasaData.name,
        kategori_jasa: daftarJasaData.kategori_jasa,
        jenis_jasa: daftarJasaData.jenis_jasa,
        jenis_penjualan_jasa: daftarJasaData.jenis_penjualan_jasa,
        ppn: daftarJasaData.ppn,
        status: daftarJasaData.status,
        },
        {
            uuid
        }
    )
}