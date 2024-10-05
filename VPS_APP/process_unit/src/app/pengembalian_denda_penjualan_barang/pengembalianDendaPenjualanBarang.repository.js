import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PengembalianDendaPenjualanBarangModel from "./pengembalianDendaPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPengembalianDendaPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const pengembalianDendaPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab WHERE faktur_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pengembalianDendaPenjualanBarangsCount[0].count

    const pengembalianDendaPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab WHERE faktur_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pengembalianDendaPenjualanBarangs,
        count: pengembalianDendaPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPengembalianDendaPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PengembalianDendaPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPengembalianDendaPenjualanBarangRepo = async (pengembalianDendaPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPenjualanBarangModel,
        {
            faktur_penjualan_barang: pengembalianDendaPenjualanBarangData.faktur_penjualan_barang,
            tanggal: pengembalianDendaPenjualanBarangData.tanggal,
            nomor_pengembalian_denda_penjualan_barang: pengembalianDendaPenjualanBarangData.nomor_pengembalian_denda_penjualan_barang,
            bukti_transaksi: pengembalianDendaPenjualanBarangData.bukti_transaksi,
            keterangan: pengembalianDendaPenjualanBarangData.keterangan,
            kode_akun_perkiraan: pengembalianDendaPenjualanBarangData.kode_akun_perkiraan,
            enabled: pengembalianDendaPenjualanBarangData.enabled
        }
    )
}

export const deletePengembalianDendaPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePengembalianDendaPenjualanBarangByUuidRepo = async (uuid, pengembalianDendaPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPenjualanBarangModel,
        {
            faktur_penjualan_barang: pengembalianDendaPenjualanBarangData.faktur_penjualan_barang,
            tanggal: pengembalianDendaPenjualanBarangData.tanggal,
            nomor_pengembalian_denda_penjualan_barang: pengembalianDendaPenjualanBarangData.nomor_pengembalian_denda_penjualan_barang,
            bukti_transaksi: pengembalianDendaPenjualanBarangData.bukti_transaksi,
            keterangan: pengembalianDendaPenjualanBarangData.keterangan,
            kode_akun_perkiraan: pengembalianDendaPenjualanBarangData.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}