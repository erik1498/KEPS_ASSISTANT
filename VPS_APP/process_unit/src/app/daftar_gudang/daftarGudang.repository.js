import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarGudangModel from "./daftarGudang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllDaftarGudangRepo = async (pageNumber, size, search, req_id) => {
    const daftarGudangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.daftar_gudang_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarGudangsCount[0].count

    const daftarGudangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.daftar_gudang_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: daftarGudangs,
        count: daftarGudangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDaftarGudangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DaftarGudangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDaftarGudangRepo = async (daftarGudangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarGudangModel,
        {   
        name: daftarGudangData.name,
        kategori_gudang: daftarGudangData.kategori_gudang,
        jenis_gudang: daftarGudangData.jenis_gudang,
            enabled: daftarGudangData.enabled
        }
    )
}

export const deleteDaftarGudangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarGudangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDaftarGudangByUuidRepo = async (uuid, daftarGudangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarGudangModel,
        {
        name: daftarGudangData.name,
        kategori_gudang: daftarGudangData.kategori_gudang,
        jenis_gudang: daftarGudangData.jenis_gudang,
        },
        {
            uuid
        }
    )
}