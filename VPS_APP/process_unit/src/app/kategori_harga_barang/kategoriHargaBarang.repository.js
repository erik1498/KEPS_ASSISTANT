import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriHargaBarangModel from "./kategoriHargaBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllKategoriHargaBarangRepo = async (pageNumber, size, search, req_id) => {
    const kategoriHargaBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            WHERE 
            sbt.name LIKE '%${search}%'
            AND sbt.enabled = 1 
            AND khbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriHargaBarangsCount[0].count

    const kategoriHargaBarangs = await db.query(
        `
            SELECT 
                khbt.*,
                sbt.name AS satuan_barang_name
            FROM ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            WHERE 
            sbt.name LIKE '%${search}%'
            AND sbt.enabled = 1 
            AND khbt.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriHargaBarangs,
        count: kategoriHargaBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriHargaBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriHargaBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKategoriHargaBarangRepo = async (kategoriHargaBarangData, req_id) => {
    kategoriHargaBarangData = removeDotInRupiahInput(kategoriHargaBarangData, [
        "harga_1", "harga_2", "harga_3", "harga_4", "harga_5",
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaBarangModel,
        {   
        daftar_barang: kategoriHargaBarangData.daftar_barang,
        kode_barang: kategoriHargaBarangData.kode_barang,
        satuan_barang: kategoriHargaBarangData.satuan_barang,
        harga_1: kategoriHargaBarangData.harga_1,
        harga_2: kategoriHargaBarangData.harga_2,
        harga_3: kategoriHargaBarangData.harga_3,
        harga_4: kategoriHargaBarangData.harga_4,
        harga_5: kategoriHargaBarangData.harga_5,
            enabled: kategoriHargaBarangData.enabled
        }
    )
}

export const deleteKategoriHargaBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriHargaBarangByUuidRepo = async (uuid, kategoriHargaBarangData, req_id) => {
    kategoriHargaBarangData = removeDotInRupiahInput(kategoriHargaBarangData, [
        "harga_1", "harga_2", "harga_3", "harga_4", "harga_5",
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaBarangModel,
        {
        daftar_barang: kategoriHargaBarangData.daftar_barang,
        kode_barang: kategoriHargaBarangData.kode_barang,
        satuan_barang: kategoriHargaBarangData.satuan_barang,
        harga_1: kategoriHargaBarangData.harga_1,
        harga_2: kategoriHargaBarangData.harga_2,
        harga_3: kategoriHargaBarangData.harga_3,
        harga_4: kategoriHargaBarangData.harga_4,
        harga_5: kategoriHargaBarangData.harga_5,
        },
        {
            uuid
        }
    )
}

export const getKategoriHargaBarangByKodeBarangRepo = async (kode_barang, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriHargaBarangModel,
        null,
        {
            kode_barang,
            enabled: true
        }
    )
}