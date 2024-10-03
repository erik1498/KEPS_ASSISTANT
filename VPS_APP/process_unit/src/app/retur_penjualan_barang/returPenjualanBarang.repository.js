import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import ReturPenjualanBarangModel from "./returPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllReturPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const returPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab WHERE faktur_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : returPenjualanBarangsCount[0].count

    const returPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab WHERE faktur_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: returPenjualanBarangs,
        count: returPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getCekDendaByReturPenjualanUUIDRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getReturPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        ReturPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createReturPenjualanBarangRepo = async (returPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPenjualanBarangModel,
        {
            faktur_penjualan_barang: returPenjualanBarangData.faktur_penjualan_barang,
            tanggal: returPenjualanBarangData.tanggal,
            bukti_transaksi: returPenjualanBarangData.bukti_transaksi,
            nomor_retur_penjualan_barang: returPenjualanBarangData.nomor_retur_penjualan_barang,
            kode_akun_perkiraan: returPenjualanBarangData.kode_akun_perkiraan,
            keterangan: returPenjualanBarangData.keterangan,
            enabled: returPenjualanBarangData.enabled
        }
    )
}

export const deleteReturPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateReturPenjualanBarangByUuidRepo = async (uuid, returPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPenjualanBarangModel,
        {
            faktur_penjualan_barang: returPenjualanBarangData.faktur_penjualan_barang,
            tanggal: returPenjualanBarangData.tanggal,
            bukti_transaksi: returPenjualanBarangData.bukti_transaksi,
            nomor_retur_penjualan_barang: returPenjualanBarangData.nomor_retur_penjualan_barang,
            kode_akun_perkiraan: returPenjualanBarangData.kode_akun_perkiraan,
            keterangan: returPenjualanBarangData.keterangan,
        },
        {
            uuid
        }
    )
}