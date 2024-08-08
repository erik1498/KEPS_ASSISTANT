import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StatusRiwayatAktivitasDokumenModel from "./statusRiwayatAktivitasDokumen.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumenRepo = async (riwayat_aktivitas_dokumen, pageNumber, size, search, req_id) => {
    const statusRiwayatAktivitasDokumensCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_tab WHERE riwayat_aktivitas_dokumen = "${riwayat_aktivitas_dokumen}" AND enabled = 1 AND judul_status LIKE '%${search}%'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : statusRiwayatAktivitasDokumensCount[0].count

    const statusRiwayatAktivitasDokumens = await db.query(
        `
            SELECT 
                * 
            FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_tab 
            WHERE riwayat_aktivitas_dokumen = "${riwayat_aktivitas_dokumen}" 
            AND enabled = 1 
            AND judul_status LIKE '%${search}%' 
            ORDER BY tanggal DESC
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: statusRiwayatAktivitasDokumens,
        count: statusRiwayatAktivitasDokumensCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getStatusRiwayatAktivitasDokumenByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenModel,
        null,
        {
            uuid
        }
    )
}

export const createStatusRiwayatAktivitasDokumenRepo = async (statusRiwayatAktivitasDokumenData, req_id) => {
    return insertQueryUtil(
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenModel,
        {
            riwayat_aktivitas_dokumen: statusRiwayatAktivitasDokumenData.riwayat_aktivitas_dokumen,
            judul_status: statusRiwayatAktivitasDokumenData.judul_status,
            tanggal: statusRiwayatAktivitasDokumenData.tanggal,
            enabled: statusRiwayatAktivitasDokumenData.enabled,
        }
    )
}

export const deleteStatusRiwayatAktivitasDokumenByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateStatusRiwayatAktivitasDokumenByUuidRepo = async (uuid, statusRiwayatAktivitasDokumenData) => {
    const statusRiwayatAktivitasDokumen = await StatusRiwayatAktivitasDokumenModel.update({
        riwayat_aktivitas_dokumen: statusRiwayatAktivitasDokumenData.riwayat_aktivitas_dokumen,
        judul_status: statusRiwayatAktivitasDokumenData.judul_status,
        tanggal: statusRiwayatAktivitasDokumenData.tanggal,
        enabled: statusRiwayatAktivitasDokumenData.enabled,
    }, {
        where: {
            uuid
        }
    })
    return statusRiwayatAktivitasDokumen
}