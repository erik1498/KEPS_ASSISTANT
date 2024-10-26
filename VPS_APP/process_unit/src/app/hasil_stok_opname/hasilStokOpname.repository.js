import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import HasilStokOpnameModel from "./hasilStokOpname.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllHasilStokOpnameRepo = async (pageNumber, size, search, req_id) => {
    const hasilStokOpnamesCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : hasilStokOpnamesCount[0].count

    const hasilStokOpnames = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: hasilStokOpnames,
        count: hasilStokOpnamesCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getHasilStokOpnameByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        HasilStokOpnameModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createHasilStokOpnameRepo = async (hasilStokOpnameData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HasilStokOpnameModel,
        {   
        tanggal: hasilStokOpnameData.tanggal,
        perintah_stok_opname: hasilStokOpnameData.perintah_stok_opname,
        stok_awal_barang: hasilStokOpnameData.stok_awal_barang,
        kuantitas: hasilStokOpnameData.kuantitas,
            enabled: hasilStokOpnameData.enabled
        }
    )
}

export const deleteHasilStokOpnameByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HasilStokOpnameModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateHasilStokOpnameByUuidRepo = async (uuid, hasilStokOpnameData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HasilStokOpnameModel,
        {
        tanggal: hasilStokOpnameData.tanggal,
        perintah_stok_opname: hasilStokOpnameData.perintah_stok_opname,
        stok_awal_barang: hasilStokOpnameData.stok_awal_barang,
        kuantitas: hasilStokOpnameData.kuantitas,
        },
        {
            uuid
        }
    )
}