import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KonversiBahanBakuModel from "./konversiBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKonversiBahanBakuRepo = async (pageNumber, size, search, tahun, req_id) => {
    const konversiBahanBakusCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab kbt 
            WHERE kbt.kode_konversi_bahan_baku LIKE '%${search}%'
            AND YEAR(kbt.tanggal) = ${tahun}
            AND kbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : konversiBahanBakusCount[0].count

    const konversiBahanBakus = await db.query(
        `
            SELECT 
                kbt.*
            FROM ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab kbt 
            WHERE kbt.kode_konversi_bahan_baku LIKE '%${search}%'
            AND kbt.enabled = 1
            AND YEAR(kbt.tanggal) = ${tahun}
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: konversiBahanBakus,
        count: konversiBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKonversiBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KonversiBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKonversiBahanBakuRepo = async (konversiBahanBakuData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KonversiBahanBakuModel,
        {
            tanggal: konversiBahanBakuData.tanggal,
            kode_konversi_bahan_baku: konversiBahanBakuData.kode_konversi_bahan_baku,
            daftar_gudang: konversiBahanBakuData.daftar_gudang,
            satuan_bahan_baku: konversiBahanBakuData.satuan_bahan_baku,
            enabled: konversiBahanBakuData.enabled
        }
    )
}

export const deleteKonversiBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KonversiBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKonversiBahanBakuByUuidRepo = async (uuid, konversiBahanBakuData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KonversiBahanBakuModel,
        {
            tanggal: konversiBahanBakuData.tanggal,
            kode_konversi_bahan_baku: konversiBahanBakuData.kode_konversi_bahan_baku,
            daftar_gudang: konversiBahanBakuData.daftar_gudang,
            satuan_bahan_baku: konversiBahanBakuData.satuan_bahan_baku,
        },
        {
            uuid
        }
    )
}