import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PenyesuaianPersediaanModel from "./penyesuaianPersediaan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPenyesuaianPersediaanRepo = async (pageNumber, size, search, req_id) => {
    const penyesuaianPersediaansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : penyesuaianPersediaansCount[0].count

    const penyesuaianPersediaans = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: penyesuaianPersediaans,
        count: penyesuaianPersediaansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPenyesuaianPersediaanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PenyesuaianPersediaanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPenyesuaianPersediaanRepo = async (penyesuaianPersediaanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenyesuaianPersediaanModel,
        {   
        tanggal: penyesuaianPersediaanData.tanggal,
        perintah_stok_opname: penyesuaianPersediaanData.perintah_stok_opname,
        hasil_stok_opname: penyesuaianPersediaanData.hasil_stok_opname,
        kuantitas: penyesuaianPersediaanData.kuantitas,
        stok_tersedia_sistem: penyesuaianPersediaanData.stok_tersedia_sistem,
        tipe_penyesuaian: penyesuaianPersediaanData.tipe_penyesuaian,
        jumlah: penyesuaianPersediaanData.jumlah,
        keterangan: penyesuaianPersediaanData.keterangan,
            enabled: penyesuaianPersediaanData.enabled
        }
    )
}

export const deletePenyesuaianPersediaanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenyesuaianPersediaanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePenyesuaianPersediaanByUuidRepo = async (uuid, penyesuaianPersediaanData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenyesuaianPersediaanModel,
        {
        tanggal: penyesuaianPersediaanData.tanggal,
        perintah_stok_opname: penyesuaianPersediaanData.perintah_stok_opname,
        hasil_stok_opname: penyesuaianPersediaanData.hasil_stok_opname,
        kuantitas: penyesuaianPersediaanData.kuantitas,
        stok_tersedia_sistem: penyesuaianPersediaanData.stok_tersedia_sistem,
        tipe_penyesuaian: penyesuaianPersediaanData.tipe_penyesuaian,
        jumlah: penyesuaianPersediaanData.jumlah,
        keterangan: penyesuaianPersediaanData.keterangan,
        },
        {
            uuid
        }
    )
}