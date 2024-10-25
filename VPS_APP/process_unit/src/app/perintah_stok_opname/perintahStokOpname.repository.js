import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PerintahStokOpnameModel from "./perintahStokOpname.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPerintahStokOpnameRepo = async (pageNumber, size, search, req_id) => {
    const perintahStokOpnamesCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : perintahStokOpnamesCount[0].count

    const perintahStokOpnames = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: perintahStokOpnames,
        count: perintahStokOpnamesCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPerintahStokOpnameByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPerintahStokOpnameRepo = async (perintahStokOpnameData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {   
        tanggal: perintahStokOpnameData.tanggal,
        nomor_surat_perintah: perintahStokOpnameData.nomor_surat_perintah,
        pegawai_penanggung_jawab: perintahStokOpnameData.pegawai_penanggung_jawab,
        pegawai_pelaksana: perintahStokOpnameData.pegawai_pelaksana,
        kategori_barang: perintahStokOpnameData.kategori_barang,
        gudang_asal: perintahStokOpnameData.gudang_asal,
        validasi: perintahStokOpnameData.validasi,
            enabled: perintahStokOpnameData.enabled
        }
    )
}

export const deletePerintahStokOpnameByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePerintahStokOpnameByUuidRepo = async (uuid, perintahStokOpnameData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
        tanggal: perintahStokOpnameData.tanggal,
        nomor_surat_perintah: perintahStokOpnameData.nomor_surat_perintah,
        pegawai_penanggung_jawab: perintahStokOpnameData.pegawai_penanggung_jawab,
        pegawai_pelaksana: perintahStokOpnameData.pegawai_pelaksana,
        kategori_barang: perintahStokOpnameData.kategori_barang,
        gudang_asal: perintahStokOpnameData.gudang_asal,
        validasi: perintahStokOpnameData.validasi,
        },
        {
            uuid
        }
    )
}