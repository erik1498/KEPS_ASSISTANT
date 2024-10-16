import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import ReturPembelianBarangModel from "./returPembelianBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllReturPembelianBarangRepo = async (pageNumber, size, search, req_id) => {
    const returPembelianBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab WHERE faktur_pembelian_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : returPembelianBarangsCount[0].count

    const returPembelianBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab WHERE faktur_pembelian_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: returPembelianBarangs,
        count: returPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getCekDendaByReturPembelianUUIDRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getReturPembelianBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        ReturPembelianBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createReturPembelianBarangRepo = async (returPembelianBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPembelianBarangModel,
        {
            faktur_pembelian_barang: returPembelianBarangData.faktur_pembelian_barang,
            tanggal: returPembelianBarangData.tanggal,
            bukti_transaksi: returPembelianBarangData.bukti_transaksi,
            nomor_retur_pembelian_barang: returPembelianBarangData.nomor_retur_pembelian_barang,
            kode_akun_perkiraan: returPembelianBarangData.kode_akun_perkiraan,
            keterangan: returPembelianBarangData.keterangan,
            enabled: returPembelianBarangData.enabled
        }
    )
}

export const deleteReturPembelianBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPembelianBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateReturPembelianBarangByUuidRepo = async (uuid, returPembelianBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPembelianBarangModel,
        {
            faktur_pembelian_barang: returPembelianBarangData.faktur_pembelian_barang,
            tanggal: returPembelianBarangData.tanggal,
            bukti_transaksi: returPembelianBarangData.bukti_transaksi,
            nomor_retur_pembelian_barang: returPembelianBarangData.nomor_retur_pembelian_barang,
            kode_akun_perkiraan: returPembelianBarangData.kode_akun_perkiraan,
            keterangan: returPembelianBarangData.keterangan,
        },
        {
            uuid
        }
    )
}