import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PengembalianDendaPembelianBarangModel from "./pengembalianDendaPembelianBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPengembalianDendaPembelianBarangRepo = async (pageNumber, size, search, req_id) => {
    const pengembalianDendaPembelianBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab WHERE faktur_pembelian_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pengembalianDendaPembelianBarangsCount[0].count

    const pengembalianDendaPembelianBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab WHERE faktur_pembelian_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pengembalianDendaPembelianBarangs,
        count: pengembalianDendaPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPengembalianDendaPembelianBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PengembalianDendaPembelianBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPengembalianDendaPembelianBarangRepo = async (pengembalianDendaPembelianBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPembelianBarangModel,
        {
            faktur_pembelian_barang: pengembalianDendaPembelianBarangData.faktur_pembelian_barang,
            tanggal: pengembalianDendaPembelianBarangData.tanggal,
            nomor_pengembalian_denda_pembelian_barang: pengembalianDendaPembelianBarangData.nomor_pengembalian_denda_pembelian_barang,
            bukti_transaksi: pengembalianDendaPembelianBarangData.bukti_transaksi,
            keterangan: pengembalianDendaPembelianBarangData.keterangan,
            kode_akun_perkiraan: pengembalianDendaPembelianBarangData.kode_akun_perkiraan,
            enabled: pengembalianDendaPembelianBarangData.enabled
        }
    )
}

export const deletePengembalianDendaPembelianBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPembelianBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePengembalianDendaPembelianBarangByUuidRepo = async (uuid, pengembalianDendaPembelianBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPembelianBarangModel,
        {
            faktur_pembelian_barang: pengembalianDendaPembelianBarangData.faktur_pembelian_barang,
            tanggal: pengembalianDendaPembelianBarangData.tanggal,
            nomor_pengembalian_denda_pembelian_barang: pengembalianDendaPembelianBarangData.nomor_pengembalian_denda_pembelian_barang,
            bukti_transaksi: pengembalianDendaPembelianBarangData.bukti_transaksi,
            keterangan: pengembalianDendaPembelianBarangData.keterangan,
            kode_akun_perkiraan: pengembalianDendaPembelianBarangData.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}