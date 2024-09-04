import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import TipePembayaranModel from "./tipePembayaran.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllTipePembayaranRepo = async (pageNumber, size, search, req_id) => {
    const tipePembayaransCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.tipe_pembayaran_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : tipePembayaransCount[0].count

    const tipePembayarans = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.tipe_pembayaran_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: tipePembayarans,
        count: tipePembayaransCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getTipePembayaranByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        TipePembayaranModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createTipePembayaranRepo = async (tipePembayaranData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TipePembayaranModel,
        {
            name: tipePembayaranData.name,
            enabled: tipePembayaranData.enabled
        }
    )
}

export const deleteTipePembayaranByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TipePembayaranModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateTipePembayaranByUuidRepo = async (uuid, tipePembayaranData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TipePembayaranModel,
        {
            name: tipePembayaranData.name,
        },
        {
            uuid
        }
    )
}