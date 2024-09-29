import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import SyaratPembayaranModel from "./syaratPembayaran.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllSyaratPembayaranRepo = async (pageNumber, size, search, req_id) => {
    const syaratPembayaransCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = spt.tipe_pembayaran 
            WHERE spt.name LIKE '%${search}%' AND spt.enabled = 1 AND tpt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : syaratPembayaransCount[0].count

    const syaratPembayarans = await db.query(
        `
            SELECT 
                spt.*,
                tpt.name AS tipe_pembayaran_name
            FROM ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = spt.tipe_pembayaran 
            WHERE spt.name LIKE '%${search}%' AND spt.enabled = 1 AND tpt.enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: syaratPembayarans,
        count: syaratPembayaransCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllSyaratPembayaranByTipePembayaranUUIDRepo = async (tipe_pembayaran_uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                syarat_pembayaran_tab.*, 
                tipe_pembayaran_tab.name AS tipe_pembayaran_name
            FROM ${generateDatabaseName(req_id)}.syarat_pembayaran_tab 
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab ON syarat_pembayaran_tab.tipe_pembayaran = tipe_pembayaran_tab.uuid
            WHERE tipe_pembayaran_tab.uuid = '${tipe_pembayaran_uuid}'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getSyaratPembayaranByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        SyaratPembayaranModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createSyaratPembayaranRepo = async (syaratPembayaranData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SyaratPembayaranModel,
        {   
        tipe_pembayaran: syaratPembayaranData.tipe_pembayaran,
        name: syaratPembayaranData.name,
        hari_kadaluarsa: syaratPembayaranData.hari_kadaluarsa,
        denda: syaratPembayaranData.denda,
            enabled: syaratPembayaranData.enabled
        }
    )
}

export const deleteSyaratPembayaranByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SyaratPembayaranModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateSyaratPembayaranByUuidRepo = async (uuid, syaratPembayaranData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SyaratPembayaranModel,
        {
        tipe_pembayaran: syaratPembayaranData.tipe_pembayaran,
        name: syaratPembayaranData.name,
        hari_kadaluarsa: syaratPembayaranData.hari_kadaluarsa,
        denda: syaratPembayaranData.denda,
        },
        {
            uuid
        }
    )
}