import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPesananPenjualanJasaModel from "./rincianPesananPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPesananPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const rincianPesananPenjualanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab WHERE pesanan_penjualan_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPesananPenjualanJasasCount[0].count

    const rincianPesananPenjualanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab WHERE pesanan_penjualan_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPesananPenjualanJasas,
        count: rincianPesananPenjualanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianPesananPenjualanJasaByPesananPenjualanUUIDRepo = async (pesanan_penjualan_jasa, req_id) => {
    const rincianPesananPenjualanJasas = await db.query(
        `
            SELECT 
                khbt.kode_jasa AS kategori_harga_jasa_kode_jasa,
                dbt.name AS daftar_jasa_name,
                ct.name AS cabang_name,
                sbt.name AS satuan_jasa_name,
                jbt.code AS jenis_jasa_code,
                rppbt.*
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = rppbt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = khbt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct ON ct.uuid = sabt.cabang 
            JOIN ${generateDatabaseName(req_id)}.jenis_jasa_tab jbt ON jbt.uuid = dbt.jenis_jasa 
            WHERE ppbt.uuid = "${pesanan_penjualan_jasa}"
            AND ppbt.enabled = 1
            AND rppbt.enabled = 1
            ORDER BY rppbt.id DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return rincianPesananPenjualanJasas
}

export const getRincianPesananPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPesananPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPesananPenjualanJasaRepo = async (rincianPesananPenjualanJasaData, req_id) => {
    rincianPesananPenjualanJasaData = removeDotInRupiahInput(rincianPesananPenjualanJasaData, [
        "jumlah", "harga", "harga_setelah_diskon", "ppn", "ppn_setelah_diskon", "diskon_angka", "diskon_persentase", "total_harga"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPenjualanJasaModel,
        {
            pesanan_penjualan_jasa: rincianPesananPenjualanJasaData.pesanan_penjualan_jasa,
            kategori_harga_jasa: rincianPesananPenjualanJasaData.kategori_harga_jasa,
            stok_awal_jasa: rincianPesananPenjualanJasaData.stok_awal_jasa,
            kode_harga_customer: rincianPesananPenjualanJasaData.kode_harga_customer,
            jumlah: rincianPesananPenjualanJasaData.jumlah,
            harga: rincianPesananPenjualanJasaData.harga,
            harga_setelah_diskon: rincianPesananPenjualanJasaData.harga_setelah_diskon,
            ppn: rincianPesananPenjualanJasaData.ppn,
            ppn_setelah_diskon: rincianPesananPenjualanJasaData.ppn_setelah_diskon,
            diskon_angka: rincianPesananPenjualanJasaData.diskon_angka,
            diskon_persentase: rincianPesananPenjualanJasaData.diskon_persentase,
            total_harga: rincianPesananPenjualanJasaData.total_harga,
            enabled: rincianPesananPenjualanJasaData.enabled
        }
    )
}

export const deleteRincianPesananPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPesananPenjualanJasaByUuidRepo = async (uuid, rincianPesananPenjualanJasaData, req_id) => {
    rincianPesananPenjualanJasaData = removeDotInRupiahInput(rincianPesananPenjualanJasaData, [
        "jumlah", "harga", "harga_setelah_diskon", "ppn", "ppn_setelah_diskon", "diskon_angka", "diskon_persentase", "total_harga"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPesananPenjualanJasaModel,
        {
            pesanan_penjualan_jasa: rincianPesananPenjualanJasaData.pesanan_penjualan_jasa,
            kategori_harga_jasa: rincianPesananPenjualanJasaData.kategori_harga_jasa,
            stok_awal_jasa: rincianPesananPenjualanJasaData.stok_awal_jasa,
            kode_harga_customer: rincianPesananPenjualanJasaData.kode_harga_customer,
            jumlah: rincianPesananPenjualanJasaData.jumlah,
            harga: rincianPesananPenjualanJasaData.harga,
            harga_setelah_diskon: rincianPesananPenjualanJasaData.harga_setelah_diskon,
            ppn: rincianPesananPenjualanJasaData.ppn,
            ppn_setelah_diskon: rincianPesananPenjualanJasaData.ppn_setelah_diskon,
            diskon_angka: rincianPesananPenjualanJasaData.diskon_angka,
            diskon_persentase: rincianPesananPenjualanJasaData.diskon_persentase,
            total_harga: rincianPesananPenjualanJasaData.total_harga
        },
        {
            uuid
        }
    )
}