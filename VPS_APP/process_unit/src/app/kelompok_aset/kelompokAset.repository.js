import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KelompokAsetModel from "./kelompokAset.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKelompokAsetRepo = async (pageNumber, size, search, req_id) => {
    const kelompokAsetsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kelompok_aset_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kelompokAsetsCount[0].count

    const kelompokAsets = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.kelompok_aset_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kelompokAsets,
        count: kelompokAsetsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKelompokAsetByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KelompokAsetModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKelompokAsetRepo = async (kelompokAsetData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KelompokAsetModel,
        {   
        name: kelompokAsetData.name,
        masa_penyusutan: kelompokAsetData.masa_penyusutan,
            enabled: kelompokAsetData.enabled
        }
    )
}

export const deleteKelompokAsetByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KelompokAsetModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKelompokAsetByUuidRepo = async (uuid, kelompokAsetData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KelompokAsetModel,
        {
        name: kelompokAsetData.name,
        masa_penyusutan: kelompokAsetData.masa_penyusutan,
        },
        {
            uuid
        }
    )
}