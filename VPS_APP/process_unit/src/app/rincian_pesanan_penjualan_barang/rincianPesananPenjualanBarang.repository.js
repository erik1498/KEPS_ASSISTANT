import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPesananPenjualanBarangModel from "./rincianPesananPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPesananPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianPesananPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab WHERE pesanan_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPesananPenjualanBarangsCount[0].count

    const rincianPesananPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab WHERE pesanan_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPesananPenjualanBarangs,
        count: rincianPesananPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianPesananPenjualanBarangByPesananPenjualanUUIDRepo = async (pesanan_penjualan_barang, req_id) => {
    const rincianPesananPenjualanBarangs = await db.query(
        `
            SELECT 
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                dbt.name AS daftar_barang_name,
                sbt.name AS satuan_barang_name,
                jbt.code AS jenis_barang_code,
                rppbt.*
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang 
            WHERE ppbt.uuid = "${pesanan_penjualan_barang}"
            AND ppbt.enabled = 1
            AND rppbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return rincianPesananPenjualanBarangs
}

export const getRincianPesananPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPesananPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPesananPenjualanBarangRepo = async (rincianPesananPenjualanBarangData, req_id) => {
    rincianPesananPenjualanBarangData = removeDotInRupiahInput(rincianPesananPenjualanBarangData, [
        "jumlah", "harga", "ppn", "diskon_angka", "diskon_persentase", "total_harga"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPenjualanBarangModel,
        {
            pesanan_penjualan_barang: rincianPesananPenjualanBarangData.pesanan_penjualan_barang,
            kategori_harga_barang: rincianPesananPenjualanBarangData.kategori_harga_barang,
            stok_awal_barang: rincianPesananPenjualanBarangData.stok_awal_barang,
            kode_harga_customer: rincianPesananPenjualanBarangData.kode_harga_customer,
            jumlah: rincianPesananPenjualanBarangData.jumlah,
            harga: rincianPesananPenjualanBarangData.harga,
            ppn: rincianPesananPenjualanBarangData.ppn,
            diskon_angka: rincianPesananPenjualanBarangData.diskon_angka,
            diskon_persentase: rincianPesananPenjualanBarangData.diskon_persentase,
            total_harga: rincianPesananPenjualanBarangData.total_harga,
            enabled: rincianPesananPenjualanBarangData.enabled
        }
    )
}

export const deleteRincianPesananPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPesananPenjualanBarangByUuidRepo = async (uuid, rincianPesananPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPenjualanBarangModel,
        {
            pesanan_penjualan_barang: rincianPesananPenjualanBarangData.pesanan_penjualan_barang,
            kategori_harga_barang: rincianPesananPenjualanBarangData.kategori_harga_barang,
            stok_awal_barang: rincianPesananPenjualanBarangData.stok_awal_barang,
            kode_harga_customer: rincianPesananPenjualanBarangData.kode_harga_customer,
            jumlah: rincianPesananPenjualanBarangData.jumlah,
            harga: rincianPesananPenjualanBarangData.harga,
            ppn: rincianPesananPenjualanBarangData.ppn,
            diskon_angka: rincianPesananPenjualanBarangData.diskon_angka,
            diskon_persentase: rincianPesananPenjualanBarangData.diskon_persentase,
            total_harga: rincianPesananPenjualanBarangData.total_harga,
        },
        {
            uuid
        }
    )
}