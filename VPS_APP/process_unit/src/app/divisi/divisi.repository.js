import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DivisiModel from "./divisi.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllDivisiRepo = async (pageNumber, size, search, req_id) => {
    const divisisCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.divisi_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : divisisCount[0].count

    const divisis = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.divisi_tab ct
            WHERE ct.name LIKE '%${search}%' 
            AND ct.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: divisis,
        count: divisisCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDivisiByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DivisiModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDivisiRepo = async (divisiData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DivisiModel,
        {
            name: divisiData.name,
            enabled: divisiData.enabled
        }
    )
}

export const deleteDivisiByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DivisiModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDivisiByUuidRepo = async (uuid, divisiData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DivisiModel,
        {
            name: divisiData.name
        },
        {
            uuid
        }
    )
}

export const checkDivisiDipakaiPegawaiRepo = async(uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                pt.name,
                pt.nik
            FROM ${generateDatabaseName(req_id)}.pegawai_tab pt 
            WHERE pt.divisi = "${uuid}"
            AND pt.enabled = 1 
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}