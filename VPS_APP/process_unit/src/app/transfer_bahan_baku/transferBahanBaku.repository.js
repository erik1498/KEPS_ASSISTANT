import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import TransferBahanBakuModel from "./transferBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllTransferBahanBakuRepo = async (pageNumber, size, search, tahun, req_id) => {
    const transferBahanBakusCount = await db.query(
        `
            SELECT
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt_asal ON dgt_asal.uuid = tbt.daftar_gudang_asal 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt_akhir ON dgt_akhir.uuid = tbt.daftar_gudang_akhir 
            WHERE tbt.tanggal LIKE '%${search}%'
            AND tbt.enabled = 1
            AND YEAR(tbt.tanggal) = ${tahun}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    if (transferBahanBakusCount.length < 1) {
        transferBahanBakusCount.push({ count: 0 })
    }

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : transferBahanBakusCount[0].count

    const transferBahanBakus = await db.query(
        `
            SELECT
                tbt.*,
                dgt_asal.name AS daftar_gudang_asal_name,
                dgt_akhir.name AS daftar_gudang_akhir_name
            FROM ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt
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
        entry: transferBahanBakus,
        count: transferBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getTransferBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        TransferBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createTransferBahanBakuRepo = async (transferBahanBakuData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransferBahanBakuModel,
        {
            tanggal: transferBahanBakuData.tanggal,
            kode_transfer_bahan_baku: transferBahanBakuData.kode_transfer_bahan_baku,
            daftar_gudang_asal: transferBahanBakuData.daftar_gudang_asal,
            daftar_gudang_akhir: transferBahanBakuData.daftar_gudang_akhir,
            enabled: transferBahanBakuData.enabled
        }
    )
}

export const deleteTransferBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransferBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateTransferBahanBakuByUuidRepo = async (uuid, transferBahanBakuData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransferBahanBakuModel,
        {
            tanggal: transferBahanBakuData.tanggal,
            kode_transfer_bahan_baku: transferBahanBakuData.kode_transfer_bahan_baku,
            daftar_gudang_asal: transferBahanBakuData.daftar_gudang_asal,
            daftar_gudang_akhir: transferBahanBakuData.daftar_gudang_akhir
        },
        {
            uuid
        }
    )
}