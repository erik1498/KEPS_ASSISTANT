import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PerintahStokOpnameJurnalModel from "./perintahStokOpnameJurnal.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPerintahStokOpnameJurnalRepo = async (pageNumber, size, search, req_id) => {
    const perintahStokOpnameJurnalsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab WHERE bukti_transaksi LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : perintahStokOpnameJurnalsCount[0].count

    const perintahStokOpnameJurnals = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab WHERE bukti_transaksi LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: perintahStokOpnameJurnals,
        count: perintahStokOpnameJurnalsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPerintahStokOpnameJurnalByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PerintahStokOpnameJurnalModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPerintahStokOpnameJurnalRepo = async (perintahStokOpnameJurnalData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameJurnalModel,
        {
            perintah_stok_opname: perintahStokOpnameJurnalData.perintah_stok_opname,
            bukti_transaksi: perintahStokOpnameJurnalData.bukti_transaksi,
            bulan: perintahStokOpnameJurnalData.bulan,
            detail_data: perintahStokOpnameJurnalData.detail_data,
            detail_json: perintahStokOpnameJurnalData.detail_json,
            sumber: perintahStokOpnameJurnalData.sumber,
            tahun: perintahStokOpnameJurnalData.tahun,
            tanggal: perintahStokOpnameJurnalData.tanggal,
            uraian: perintahStokOpnameJurnalData.uraian,
            enabled: perintahStokOpnameJurnalData.enabled
        }
    )
}

export const deletePerintahStokOpnameJurnalByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameJurnalModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePerintahStokOpnameJurnalByUuidRepo = async (uuid, perintahStokOpnameJurnalData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameJurnalModel,
        {
            perintah_stok_opname: perintahStokOpnameJurnalData.perintah_stok_opname,
            bukti_transaksi: perintahStokOpnameJurnalData.bukti_transaksi,
            bulan: perintahStokOpnameJurnalData.bulan,
            detail_data: perintahStokOpnameJurnalData.detail_data,
            detail_json: perintahStokOpnameJurnalData.detail_json,
            sumber: perintahStokOpnameJurnalData.sumber,
            tahun: perintahStokOpnameJurnalData.tahun,
            tanggal: perintahStokOpnameJurnalData.tanggal,
            uraian: perintahStokOpnameJurnalData.uraian,
        },
        {
            uuid
        }
    )
}

export const generatePerintahStokOpnameQueryRepo = async (uuid, bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                psojt.*
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab psojt 
            ${uuid ? `WHERE JSON_UNQUOTE(
                JSON_EXTRACT(
                    psojt.detail_json, 
                        '$[*].kode_akun_perkiraan'
                )
            ) LIKE '%${uuid}%'` : ``
        }
            ${uuid ? `AND` : `WHERE`} psojt.bulan = ${bulan}
            AND psojt.tahun = ${tahun}
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}