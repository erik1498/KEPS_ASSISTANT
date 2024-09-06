import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriHargaJasaModel from "./kategoriHargaJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKategoriHargaJasaRepo = async (pageNumber, size, search, req_id) => {
    const kategoriHargaJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab WHERE daftar_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriHargaJasasCount[0].count

    const kategoriHargaJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab WHERE daftar_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriHargaJasas,
        count: kategoriHargaJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriHargaJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriHargaJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKategoriHargaJasaRepo = async (kategoriHargaJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaJasaModel,
        {   
        daftar_jasa: kategoriHargaJasaData.daftar_jasa,
        kode_jasa: kategoriHargaJasaData.kode_jasa,
        satuan_jasa: kategoriHargaJasaData.satuan_jasa,
        harga_1: kategoriHargaJasaData.harga_1,
        harga_2: kategoriHargaJasaData.harga_2,
        harga_3: kategoriHargaJasaData.harga_3,
        harga_4: kategoriHargaJasaData.harga_4,
        harga_5: kategoriHargaJasaData.harga_5,
            enabled: kategoriHargaJasaData.enabled
        }
    )
}

export const deleteKategoriHargaJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriHargaJasaByUuidRepo = async (uuid, kategoriHargaJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaJasaModel,
        {
        daftar_jasa: kategoriHargaJasaData.daftar_jasa,
        kode_jasa: kategoriHargaJasaData.kode_jasa,
        satuan_jasa: kategoriHargaJasaData.satuan_jasa,
        harga_1: kategoriHargaJasaData.harga_1,
        harga_2: kategoriHargaJasaData.harga_2,
        harga_3: kategoriHargaJasaData.harga_3,
        harga_4: kategoriHargaJasaData.harga_4,
        harga_5: kategoriHargaJasaData.harga_5,
        },
        {
            uuid
        }
    )
}