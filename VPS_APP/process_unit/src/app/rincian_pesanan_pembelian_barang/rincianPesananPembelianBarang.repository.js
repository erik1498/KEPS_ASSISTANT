import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPesananPembelianBarangModel from "./rincianPesananPembelianBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPesananPembelianBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianPesananPembelianBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab WHERE pesanan_pembelian_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPesananPembelianBarangsCount[0].count

    const rincianPesananPembelianBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab WHERE pesanan_pembelian_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPesananPembelianBarangs,
        count: rincianPesananPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianPesananPembelianBarangByPesananPembelianUUIDRepo = async (pesanan_pembelian_barang, req_id) => {
    const rincianPesananPembelianBarangs = await db.query(
        `
            SELECT 
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                dbt.name AS daftar_barang_name,
                dgt.name AS daftar_gudang_name,
                sbt.name AS satuan_barang_name,
                jbt.code AS jenis_barang_code,
                rppbt.*
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang 
            WHERE ppbt.uuid = "${pesanan_pembelian_barang}"
            AND ppbt.enabled = 1
            AND rppbt.enabled = 1
            ORDER BY rppbt.id DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return rincianPesananPembelianBarangs
}

export const getRincianPesananPembelianBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPesananPembelianBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPesananPembelianBarangRepo = async (rincianPesananPembelianBarangData, req_id) => {
    rincianPesananPembelianBarangData = removeDotInRupiahInput(rincianPesananPembelianBarangData, [
        "jumlah", "harga", "harga_setelah_diskon", "ppn", "ppn_setelah_diskon", "diskon_angka", "diskon_persentase", "total_harga"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPembelianBarangModel,
        {
            pesanan_pembelian_barang: rincianPesananPembelianBarangData.pesanan_pembelian_barang,
            kategori_harga_barang: rincianPesananPembelianBarangData.kategori_harga_barang,
            stok_awal_barang: rincianPesananPembelianBarangData.stok_awal_barang,
            jumlah: rincianPesananPembelianBarangData.jumlah,
            harga: rincianPesananPembelianBarangData.harga,
            ppn: rincianPesananPembelianBarangData.ppn,
            total_harga: rincianPesananPembelianBarangData.total_harga,
            enabled: rincianPesananPembelianBarangData.enabled
        }
    )
}

export const deleteRincianPesananPembelianBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPembelianBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPesananPembelianBarangByUuidRepo = async (uuid, rincianPesananPembelianBarangData, req_id) => {
    rincianPesananPembelianBarangData = removeDotInRupiahInput(rincianPesananPembelianBarangData, [
        "jumlah", "harga", "harga_setelah_diskon", "ppn", "ppn_setelah_diskon", "diskon_angka", "diskon_persentase", "total_harga"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPembelianBarangModel,
        {
            pesanan_pembelian_barang: rincianPesananPembelianBarangData.pesanan_pembelian_barang,
            kategori_harga_barang: rincianPesananPembelianBarangData.kategori_harga_barang,
            stok_awal_barang: rincianPesananPembelianBarangData.stok_awal_barang,
            jumlah: rincianPesananPembelianBarangData.jumlah,
            harga: rincianPesananPembelianBarangData.harga,
            ppn: rincianPesananPembelianBarangData.ppn,
            total_harga: rincianPesananPembelianBarangData.total_harga,
        },
        {
            uuid
        }
    )
}