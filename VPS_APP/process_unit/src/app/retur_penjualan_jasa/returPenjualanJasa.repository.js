import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import ReturPenjualanJasaModel from "./returPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllReturPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const returPenjualanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab WHERE faktur_penjualan_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : returPenjualanJasasCount[0].count

    const returPenjualanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab WHERE faktur_penjualan_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: returPenjualanJasas,
        count: returPenjualanJasasCount[0].count,
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

export const getReturPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        ReturPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createReturPenjualanJasaRepo = async (returPenjualanJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPenjualanJasaModel,
        {
            faktur_penjualan_jasa: returPenjualanJasaData.faktur_penjualan_jasa,
            tanggal: returPenjualanJasaData.tanggal,
            bukti_transaksi: returPenjualanJasaData.bukti_transaksi,
            nomor_retur_penjualan_jasa: returPenjualanJasaData.nomor_retur_penjualan_jasa,
            kode_akun_perkiraan: returPenjualanJasaData.kode_akun_perkiraan,
            keterangan: returPenjualanJasaData.keterangan,
            enabled: returPenjualanJasaData.enabled
        }
    )
}

export const deleteReturPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateReturPenjualanJasaByUuidRepo = async (uuid, returPenjualanJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        ReturPenjualanJasaModel,
        {
            faktur_penjualan_jasa: returPenjualanJasaData.faktur_penjualan_jasa,
            tanggal: returPenjualanJasaData.tanggal,
            bukti_transaksi: returPenjualanJasaData.bukti_transaksi,
            nomor_retur_penjualan_jasa: returPenjualanJasaData.nomor_retur_penjualan_jasa,
            kode_akun_perkiraan: returPenjualanJasaData.kode_akun_perkiraan,
            keterangan: returPenjualanJasaData.keterangan,
        },
        {
            uuid
        }
    )
}