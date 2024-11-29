import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PengirimanBarangModel from "./pengirimanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPengirimanBarangRepo = async (pageNumber, size, search, req_id) => {
    const pengirimanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pengirimanBarangsCount[0].count

    const pengirimanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pengirimanBarangs,
        count: pengirimanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDaftarPesananByFakturPenjualanUUIDRepo = async (faktur_penjualan_barang, req_id) => {
    return await db.query(`
            SELECT 
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                dgt.name AS daftar_gudang_name,
                dbt.name AS daftar_barang_name,
                sbt.name AS satuan_barang_name,
                rppbt.*
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            WHERE rppbt.enabled = 1
            AND fpbt.uuid = "${faktur_penjualan_barang}"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getPengirimanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PengirimanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPengirimanBarangRepo = async (pengirimanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengirimanBarangModel,
        {
            tanggal: pengirimanBarangData.tanggal,
            nomor_surat_jalan: pengirimanBarangData.nomor_surat_jalan,
            faktur_penjualan: pengirimanBarangData.faktur_penjualan,
            pegawai_penanggung_jawab: pengirimanBarangData.pegawai_penanggung_jawab,
            pegawai_pelaksana: pengirimanBarangData.pegawai_pelaksana,
            enabled: pengirimanBarangData.enabled
        }
    )
}

export const deletePengirimanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengirimanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePengirimanBarangByUuidRepo = async (uuid, pengirimanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengirimanBarangModel,
        {
            tanggal: pengirimanBarangData.tanggal,
            nomor_surat_jalan: pengirimanBarangData.nomor_surat_jalan,
            faktur_penjualan: pengirimanBarangData.faktur_penjualan,
            pegawai_penanggung_jawab: pengirimanBarangData.pegawai_penanggung_jawab,
            pegawai_pelaksana: pengirimanBarangData.pegawai_pelaksana,
        },
        {
            uuid
        }
    )
}