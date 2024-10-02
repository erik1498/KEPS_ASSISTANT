import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PelunasanPenjualanBarangModel from "./pelunasanPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPelunasanPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const pelunasanPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab WHERE faktur_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pelunasanPenjualanBarangsCount[0].count

    const pelunasanPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab WHERE faktur_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pelunasanPenjualanBarangs,
        count: pelunasanPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getCekDendaByPelunasanPenjualanUUIDRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getPelunasanPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PelunasanPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPelunasanPenjualanBarangRepo = async (pelunasanPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PelunasanPenjualanBarangModel,
        {
            faktur_penjualan_barang: pelunasanPenjualanBarangData.faktur_penjualan_barang,
            tanggal: pelunasanPenjualanBarangData.tanggal,
            bukti_transaksi: pelunasanPenjualanBarangData.bukti_transaksi,
            nomor_pelunasan_penjualan_barang: pelunasanPenjualanBarangData.nomor_pelunasan_penjualan_barang,
            kode_akun_perkiraan: pelunasanPenjualanBarangData.kode_akun_perkiraan,
            keterangan: pelunasanPenjualanBarangData.keterangan,
            enabled: pelunasanPenjualanBarangData.enabled
        }
    )
}

export const deletePelunasanPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PelunasanPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePelunasanPenjualanBarangByUuidRepo = async (uuid, pelunasanPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PelunasanPenjualanBarangModel,
        {
            faktur_penjualan_barang: pelunasanPenjualanBarangData.faktur_penjualan_barang,
            tanggal: pelunasanPenjualanBarangData.tanggal,
            bukti_transaksi: pelunasanPenjualanBarangData.bukti_transaksi,
            nomor_pelunasan_penjualan_barang: pelunasanPenjualanBarangData.nomor_pelunasan_penjualan_barang,
            kode_akun_perkiraan: pelunasanPenjualanBarangData.kode_akun_perkiraan,
            keterangan: pelunasanPenjualanBarangData.keterangan,
        },
        {
            uuid
        }
    )
}