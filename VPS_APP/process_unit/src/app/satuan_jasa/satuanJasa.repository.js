import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import SatuanJasaModel from "./satuanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllSatuanJasaRepo = async (pageNumber, size, search, req_id) => {
    const satuanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.satuan_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : satuanJasasCount[0].count

    const satuanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.satuan_jasa_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: satuanJasas,
        count: satuanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getSatuanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        SatuanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createSatuanJasaRepo = async (satuanJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanJasaModel,
        {   
        name: satuanJasaData.name,
            enabled: satuanJasaData.enabled
        }
    )
}

export const deleteSatuanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateSatuanJasaByUuidRepo = async (uuid, satuanJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanJasaModel,
        {
        name: satuanJasaData.name,
        },
        {
            uuid
        }
    )
}