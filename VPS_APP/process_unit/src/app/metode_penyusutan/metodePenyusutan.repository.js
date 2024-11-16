import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import MetodePenyusutanModel from "./metodePenyusutan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllMetodePenyusutanRepo = async (pageNumber, size, search, req_id) => {
    const metodePenyusutansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.metode_penyusutan_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : metodePenyusutansCount[0].count

    const metodePenyusutans = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.metode_penyusutan_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: metodePenyusutans,
        count: metodePenyusutansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getMetodePenyusutanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        MetodePenyusutanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const checkMetodePenyusutanSudahDigunakanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat
            WHERE dat.metode_penyosotan = "${uuid}"
            AND dat.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createMetodePenyusutanRepo = async (metodePenyusutanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        MetodePenyusutanModel,
        {   
        name: metodePenyusutanData.name,
            enabled: metodePenyusutanData.enabled
        }
    )
}

export const deleteMetodePenyusutanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        MetodePenyusutanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateMetodePenyusutanByUuidRepo = async (uuid, metodePenyusutanData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        MetodePenyusutanModel,
        {
        name: metodePenyusutanData.name,
        },
        {
            uuid
        }
    )
}