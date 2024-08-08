import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StatusRiwayatAktivitasDokumenKeteranganModel from "./statusRiwayatAktivitasDokumenKeterangan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumenRepo = async (status_riwayat_aktivitas_dokumen, pageNumber, size, search, req_id) => {
    const statusRiwayatAktivitasDokumenKeterangansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_keterangan_tab WHERE status_riwayat_aktivitas_dokumen = "${status_riwayat_aktivitas_dokumen}" AND enabled = 1 AND keterangan LIKE '%${search}%'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : statusRiwayatAktivitasDokumenKeterangansCount[0].count

    const statusRiwayatAktivitasDokumenKeterangans = await db.query(
        `
            SELECT 
                * 
            FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_keterangan_tab 
            WHERE status_riwayat_aktivitas_dokumen = "${status_riwayat_aktivitas_dokumen}" 
            AND enabled = 1 
            AND keterangan LIKE '%${search}%' 
            ORDER BY tanggal DESC
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: statusRiwayatAktivitasDokumenKeterangans,
        count: statusRiwayatAktivitasDokumenKeterangansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getStatusRiwayatAktivitasDokumenKeteranganByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenKeteranganModel,
        null,
        {
            uuid
        }
    )
}

export const createStatusRiwayatAktivitasDokumenKeteranganRepo = async (statusRiwayatAktivitasDokumenKeteranganData, req_id) => {
    return insertQueryUtil(
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenKeteranganModel,
        {
            status_riwayat_aktivitas_dokumen: statusRiwayatAktivitasDokumenKeteranganData.status_riwayat_aktivitas_dokumen,
            tanggal: statusRiwayatAktivitasDokumenKeteranganData.tanggal,
            keterangan: statusRiwayatAktivitasDokumenKeteranganData.keterangan,
            enabled: statusRiwayatAktivitasDokumenKeteranganData.enabled,
        }
    )
}

export const deleteStatusRiwayatAktivitasDokumenKeteranganByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenKeteranganModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateStatusRiwayatAktivitasDokumenKeteranganByUuidRepo = async (uuid, statusRiwayatAktivitasDokumenKeteranganData) => {
    const statusRiwayatAktivitasDokumenKeterangan = await StatusRiwayatAktivitasDokumenKeteranganModel.update({
        status_riwayat_aktivitas_dokumen: statusRiwayatAktivitasDokumenKeteranganData.status_riwayat_aktivitas_dokumen,
        tanggal: statusRiwayatAktivitasDokumenKeteranganData.tanggal,
        keterangan: statusRiwayatAktivitasDokumenKeteranganData.keterangan,
        enabled: statusRiwayatAktivitasDokumenKeteranganData.enabled,
    }, {
        where: {
            uuid
        }
    })
    return statusRiwayatAktivitasDokumenKeterangan
}