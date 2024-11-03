import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import TransferBarangModel from "./transferBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllTransferBarangRepo = async (pageNumber, size, search, tahun, req_id) => {
    const transferBarangsCount = await db.query(
        `
            SELECT
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.transfer_barang_tab tbt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt_asal ON dgt_asal.uuid = tbt.daftar_gudang_asal 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt_akhir ON dgt_akhir.uuid = tbt.daftar_gudang_akhir 
            WHERE tbt.tanggal LIKE '%${search}%'
            AND tbt.enabled = 1
            AND YEAR(tbt.tanggal) = ${tahun}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    if (transferBarangsCount.length < 1) {
        transferBarangsCount.push({ count: 0 })
    }

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : transferBarangsCount[0].count

    const transferBarangs = await db.query(
        `
            SELECT
                tbt.*,
                dgt_asal.name AS daftar_gudang_asal_name,
                dgt_akhir.name AS daftar_gudang_akhir_name
            FROM ${generateDatabaseName(req_id)}.transfer_barang_tab tbt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt_asal ON dgt_asal.uuid = tbt.daftar_gudang_asal 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt_akhir ON dgt_akhir.uuid = tbt.daftar_gudang_akhir 
            WHERE tbt.tanggal LIKE '%${search}%'
            AND tbt.enabled = 1
            AND YEAR(tbt.tanggal) = ${tahun}
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: transferBarangs,
        count: transferBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getTransferBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        TransferBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createTransferBarangRepo = async (transferBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransferBarangModel,
        {
            tanggal: transferBarangData.tanggal,
            kode_transfer_barang: transferBarangData.kode_transfer_barang,
            daftar_gudang_asal: transferBarangData.daftar_gudang_asal,
            daftar_gudang_akhir: transferBarangData.daftar_gudang_akhir,
            enabled: transferBarangData.enabled
        }
    )
}

export const deleteTransferBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransferBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateTransferBarangByUuidRepo = async (uuid, transferBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransferBarangModel,
        {
            tanggal: transferBarangData.tanggal,
            kode_transfer_barang: transferBarangData.kode_transfer_barang,
            daftar_gudang_asal: transferBarangData.daftar_gudang_asal,
            daftar_gudang_akhir: transferBarangData.daftar_gudang_akhir
        },
        {
            uuid
        }
    )
}