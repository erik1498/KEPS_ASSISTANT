import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RiwayatAktivitasDokumenModel from "./riwayatAktivitasDokumen.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRiwayatAktivitasDokumenRepo = async (aktivitas_dokumen, pageNumber, size, search, req_id) => {
    const riwayatAktivitasDokumensCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.riwayat_aktivitas_dokumen_tab WHERE aktivitas_dokumen = "${aktivitas_dokumen}" AND judul_aktivitas LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : riwayatAktivitasDokumensCount[0].count

    const riwayatAktivitasDokumens = await db.query(
        `
            SELECT 
                * 
            FROM ${generateDatabaseName(req_id)}.riwayat_aktivitas_dokumen_tab 
            WHERE aktivitas_dokumen = "${aktivitas_dokumen}" 
            AND judul_aktivitas LIKE '%${search}%' 
            AND enabled = 1 
            ORDER BY tanggal DESC
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: riwayatAktivitasDokumens,
        count: riwayatAktivitasDokumensCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRiwayatAktivitasDokumenByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RiwayatAktivitasDokumenModel,
        null,
        {
            uuid
        }
    )
}

export const createRiwayatAktivitasDokumenRepo = async (riwayatAktivitasDokumenData, req_id) => {
    return insertQueryUtil(
        req_id, 
        generateDatabaseName(req_id),
        RiwayatAktivitasDokumenModel,
        {
            aktivitas_dokumen: riwayatAktivitasDokumenData.aktivitas_dokumen,
            judul_aktivitas: riwayatAktivitasDokumenData.judul_aktivitas,
            tanggal: riwayatAktivitasDokumenData.tanggal,
            enabled: riwayatAktivitasDokumenData.enabled,
        }
    )
}

export const deleteRiwayatAktivitasDokumenByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RiwayatAktivitasDokumenModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRiwayatAktivitasDokumenByUuidRepo = async (uuid, riwayatAktivitasDokumenData) => {
    const riwayatAktivitasDokumen = await RiwayatAktivitasDokumenModel.update({
        aktivitas_dokumen: riwayatAktivitasDokumenData.aktivitas_dokumen,
        judul_aktivitas: riwayatAktivitasDokumenData.judul_aktivitas,
        tanggal: riwayatAktivitasDokumenData.tanggal,
        enabled: riwayatAktivitasDokumenData.enabled,
    }, {
        where: {
            uuid
        }
    })
    return riwayatAktivitasDokumen
}