import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import FakturPenjualanBarangModel from "./fakturPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllFakturPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const fakturPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab WHERE pesanan_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : fakturPenjualanBarangsCount[0].count

    const fakturPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab WHERE pesanan_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: fakturPenjualanBarangs,
        count: fakturPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getFakturPenjualanBarangByPesananPenjualanBarangUUIDRepo = async (pesanan_penjualan_barang_uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                fpbt.*, 
                tpt.name AS tipe_pembayaran_name,
                spt.name AS syarat_pembayaran_name
            FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt 
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = fpbt.tipe_pembayaran
            JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
            WHERE fpbt.pesanan_penjualan_barang = "${pesanan_penjualan_barang_uuid}"
            AND fpbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getFakturPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        FakturPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createFakturPenjualanBarangRepo = async (fakturPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanBarangModel,
        {
            pesanan_penjualan_barang: fakturPenjualanBarangData.pesanan_penjualan_barang,
            tanggal: fakturPenjualanBarangData.tanggal,
            nomor_faktur_penjualan_barang: fakturPenjualanBarangData.nomor_faktur_penjualan_barang,
            bukti_transaksi: fakturPenjualanBarangData.bukti_transaksi,
            tipe_pembayaran: fakturPenjualanBarangData.tipe_pembayaran,
            syarat_pembayaran: fakturPenjualanBarangData.syarat_pembayaran,
            keterangan: fakturPenjualanBarangData.keterangan,
            enabled: fakturPenjualanBarangData.enabled
        }
    )
}

export const deleteFakturPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateFakturPenjualanBarangByUuidRepo = async (uuid, fakturPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanBarangModel,
        {
            pesanan_penjualan_barang: fakturPenjualanBarangData.pesanan_penjualan_barang,
            tanggal: fakturPenjualanBarangData.tanggal,
            nomor_faktur_penjualan_barang: fakturPenjualanBarangData.nomor_faktur_penjualan_barang,
            bukti_transaksi: fakturPenjualanBarangData.bukti_transaksi,
            tipe_pembayaran: fakturPenjualanBarangData.tipe_pembayaran,
            syarat_pembayaran: fakturPenjualanBarangData.syarat_pembayaran,
            keterangan: fakturPenjualanBarangData.keterangan,
        },
        {
            uuid
        }
    )
}