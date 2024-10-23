import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KonversiBarangModel from "./konversiBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKonversiBarangRepo = async (pageNumber, size, search, req_id) => {
    const konversiBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.konversi_barang_tab kbt 
            WHERE kbt.kode_konversi_barang LIKE '%${search}%'
            AND kbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : konversiBarangsCount[0].count

    const konversiBarangs = await db.query(
        `
            SELECT 
                kbt.*
            FROM ${generateDatabaseName(req_id)}.konversi_barang_tab kbt 
            WHERE kbt.kode_konversi_barang LIKE '%${search}%'
            AND kbt.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: konversiBarangs,
        count: konversiBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKonversiBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KonversiBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKonversiBarangRepo = async (konversiBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KonversiBarangModel,
        {
            tanggal: konversiBarangData.tanggal,
            kode_konversi_barang: konversiBarangData.kode_konversi_barang,
            daftar_gudang: konversiBarangData.daftar_gudang,
            satuan_barang: konversiBarangData.satuan_barang,
            enabled: konversiBarangData.enabled
        }
    )
}

export const deleteKonversiBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KonversiBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKonversiBarangByUuidRepo = async (uuid, konversiBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KonversiBarangModel,
        {
            tanggal: konversiBarangData.tanggal,
            kode_konversi_barang: konversiBarangData.kode_konversi_barang,
            daftar_gudang: konversiBarangData.daftar_gudang,
            satuan_barang: konversiBarangData.satuan_barang,
        },
        {
            uuid
        }
    )
}