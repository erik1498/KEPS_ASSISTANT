import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PengembalianDendaPenjualanJasaModel from "./pengembalianDendaPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPengembalianDendaPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const pengembalianDendaPenjualanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab WHERE faktur_penjualan_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pengembalianDendaPenjualanJasasCount[0].count

    const pengembalianDendaPenjualanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab WHERE faktur_penjualan_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pengembalianDendaPenjualanJasas,
        count: pengembalianDendaPenjualanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPengembalianDendaPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PengembalianDendaPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPengembalianDendaPenjualanJasaRepo = async (pengembalianDendaPenjualanJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPenjualanJasaModel,
        {
            faktur_penjualan_jasa: pengembalianDendaPenjualanJasaData.faktur_penjualan_jasa,
            tanggal: pengembalianDendaPenjualanJasaData.tanggal,
            nomor_pengembalian_denda_penjualan_jasa: pengembalianDendaPenjualanJasaData.nomor_pengembalian_denda_penjualan_jasa,
            bukti_transaksi: pengembalianDendaPenjualanJasaData.bukti_transaksi,
            keterangan: pengembalianDendaPenjualanJasaData.keterangan,
            kode_akun_perkiraan: pengembalianDendaPenjualanJasaData.kode_akun_perkiraan,
            enabled: pengembalianDendaPenjualanJasaData.enabled
        }
    )
}

export const deletePengembalianDendaPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePengembalianDendaPenjualanJasaByUuidRepo = async (uuid, pengembalianDendaPenjualanJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengembalianDendaPenjualanJasaModel,
        {
            faktur_penjualan_jasa: pengembalianDendaPenjualanJasaData.faktur_penjualan_jasa,
            tanggal: pengembalianDendaPenjualanJasaData.tanggal,
            nomor_pengembalian_denda_penjualan_jasa: pengembalianDendaPenjualanJasaData.nomor_pengembalian_denda_penjualan_jasa,
            bukti_transaksi: pengembalianDendaPenjualanJasaData.bukti_transaksi,
            keterangan: pengembalianDendaPenjualanJasaData.keterangan,
            kode_akun_perkiraan: pengembalianDendaPenjualanJasaData.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}