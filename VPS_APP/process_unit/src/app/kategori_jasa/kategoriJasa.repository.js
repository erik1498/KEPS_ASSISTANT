import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriJasaModel from "./kategoriJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKategoriJasaRepo = async (pageNumber, size, search, req_id) => {
    const kategoriJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kategori_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriJasasCount[0].count

    const kategoriJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.kategori_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriJasas,
        count: kategoriJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKategoriJasaRepo = async (kategoriJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriJasaModel,
        {   
        name: kategoriJasaData.name,
            enabled: kategoriJasaData.enabled
        }
    )
}

export const deleteKategoriJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriJasaByUuidRepo = async (uuid, kategoriJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriJasaModel,
        {
        name: kategoriJasaData.name,
        },
        {
            uuid
        }
    )
}