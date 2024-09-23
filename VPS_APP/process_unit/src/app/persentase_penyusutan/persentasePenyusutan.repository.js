import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PersentasePenyusutanModel from "./persentasePenyusutan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllPersentasePenyusutanRepo = async (pageNumber, size, search, req_id) => {
    const persentasePenyusutansCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.persentase_penyusutan_tab ppt
            JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = ppt.metode_penyusutan
            JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = ppt.kelompok_aset
            WHERE kat.enabled = 1
            AND mpt.enabled = 1
            AND ppt.enabled = 1
            AND mpt.name LIKE '%${search}%' 
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : persentasePenyusutansCount[0].count

    const persentasePenyusutans = await db.query(
        `
            SELECT 
                ppt.*,
                mpt.name AS metode_penyusutan_name,
                kat.name AS kelompok_aset_name,
                kat.masa_penyusutan AS masa_penyusutan
            FROM ${generateDatabaseName(req_id)}.persentase_penyusutan_tab ppt
            JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = ppt.metode_penyusutan
            JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = ppt.kelompok_aset
            WHERE kat.enabled = 1
            AND mpt.enabled = 1
            AND ppt.enabled = 1
            AND mpt.name LIKE '%${search}%' 
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: persentasePenyusutans,
        count: persentasePenyusutansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPersentasePenyusutanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PersentasePenyusutanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPersentasePenyusutanRepo = async (persentasePenyusutanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PersentasePenyusutanModel,
        {
            metode_penyusutan: persentasePenyusutanData.metode_penyusutan,
            kelompok_aset: persentasePenyusutanData.kelompok_aset,
            persentase: persentasePenyusutanData.persentase,
            enabled: persentasePenyusutanData.enabled
        }
    )
}

export const deletePersentasePenyusutanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PersentasePenyusutanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePersentasePenyusutanByUuidRepo = async (uuid, persentasePenyusutanData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PersentasePenyusutanModel,
        {
            metode_penyusutan: persentasePenyusutanData.metode_penyusutan,
            kelompok_aset: persentasePenyusutanData.kelompok_aset,
            persentase: persentasePenyusutanData.persentase,
        },
        {
            uuid
        }
    )
}