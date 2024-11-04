import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StokAwalBarangModel from "./stokAwalBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllStokAwalBarangRepo = async (pageNumber, size, search, req_id) => {
    const stokAwalBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab WHERE daftar_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : stokAwalBarangsCount[0].count

    const stokAwalBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab WHERE daftar_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: stokAwalBarangs,
        count: stokAwalBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getStokAwalBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        null,
        {
            uuid,
            enabled: 1
        }
    )
}

export const getDaftarGudangBarangByKategoriHargaBarangUUIDRepo = async (kategori_harga_barang_uuid, req_id) => {
    const daftarGudangBarangs = await db.query(
        `
            SELECT 
                sabt.uuid,
                dgt.name AS daftar_gudang_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            WHERE sabt.kategori_harga_barang = "${kategori_harga_barang_uuid}"
            AND sabt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return daftarGudangBarangs
}

export const getStokAwalBarangByBarangUUIDRepo = async (uuid, req_id) => {
    const stokAwalBarangs = await db.query(
        `
            SELECT 
                sabt.*,
                dgt.name AS daftar_gudang_name,
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                sbt.name AS satuan_barang_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            WHERE sabt.daftar_barang = "${uuid}"
            AND sabt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return stokAwalBarangs
}

export const createStokAwalBarangRepo = async (stokAwalBarangData, req_id) => {
    stokAwalBarangData = removeDotInRupiahInput(stokAwalBarangData, [
        "jumlah"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        {
            daftar_barang: stokAwalBarangData.daftar_barang,
            daftar_gudang: stokAwalBarangData.daftar_gudang,
            kategori_harga_barang: stokAwalBarangData.kategori_harga_barang,
            jumlah: stokAwalBarangData.jumlah,
            enabled: stokAwalBarangData.enabled
        }
    )
}

export const deleteStokAwalBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateStokAwalBarangByUuidRepo = async (uuid, stokAwalBarangData, req_id) => {
    stokAwalBarangData = removeDotInRupiahInput(stokAwalBarangData, [
        "jumlah"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StokAwalBarangModel,
        {
            daftar_barang: stokAwalBarangData.daftar_barang,
            daftar_gudang: stokAwalBarangData.daftar_gudang,
            kategori_harga_barang: stokAwalBarangData.kategori_harga_barang,
            jumlah: stokAwalBarangData.jumlah,
        },
        {
            uuid
        }
    )
}

export const getStokAwalBarangByDaftarGudangDanKategoriHargaBarangRepo = async (daftar_gudang, kategori_harga_barang, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt 
            WHERE sabt.daftar_gudang = "${daftar_gudang}"
            AND sabt.kategori_harga_barang = "${kategori_harga_barang}"
            AND sabt.enabled = 1
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}