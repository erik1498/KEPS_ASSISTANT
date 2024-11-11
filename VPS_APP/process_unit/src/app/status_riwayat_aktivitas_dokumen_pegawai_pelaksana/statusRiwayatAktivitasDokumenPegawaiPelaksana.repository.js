import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import StatusRiwayatAktivitasDokumenPegawaiPelaksanaModel from "./statusRiwayatAktivitasDokumenPegawaiPelaksana.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasRepo = async (tahun, req_id) => {
    const statusRiwayatAktivitasDokumenPegawaiPelaksanas = await db.query(
        `
            SELECT 
                (
                    SELECT 
                        GROUP_CONCAT(sradppt.pegawai_pelaksana) 
                    FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab sradppt 
                    WHERE sradppt.status_riwayat_aktivitas_dokumen = sradt.uuid 
                ) AS pegawai_pelaksana
            FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_tab sradt 
            JOIN ${generateDatabaseName(req_id)}.riwayat_aktivitas_dokumen_tab radt ON radt.uuid = sradt.riwayat_aktivitas_dokumen 
            JOIN ${generateDatabaseName(req_id)}.aktivitas_dokumen_tab adt ON adt.uuid = radt.aktivitas_dokumen 
            WHERE sradt.enabled = 1 AND radt.enabled =  1 AND adt.enabled = 1 AND adt.tahun = ${tahun}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return statusRiwayatAktivitasDokumenPegawaiPelaksanas
}
export const getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumenRepo = async (status_riwayat_aktivitas_dokumen, pageNumber, size, search, req_id) => {
    const statusRiwayatAktivitasDokumenPegawaiPelaksanasCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab sradppt
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = sradppt.pegawai_pelaksana
            WHERE status_riwayat_aktivitas_dokumen = "${status_riwayat_aktivitas_dokumen}" 
            AND sradppt.enabled = 1 
            AND sradppt.pegawai_pelaksana 
            LIKE '%${search}%'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : statusRiwayatAktivitasDokumenPegawaiPelaksanasCount[0].count

    const statusRiwayatAktivitasDokumenPegawaiPelaksanas = await db.query(
        `
            SELECT 
                sradppt.*,
                pt.name AS pegawai_pelaksana_name 
            FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab sradppt
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = sradppt.pegawai_pelaksana
            WHERE sradppt.status_riwayat_aktivitas_dokumen = "${status_riwayat_aktivitas_dokumen}"
            AND sradppt.enabled = 1 
            AND sradppt.pegawai_pelaksana 
            LIKE '%${search}%' LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: statusRiwayatAktivitasDokumenPegawaiPelaksanas,
        count: statusRiwayatAktivitasDokumenPegawaiPelaksanasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenPegawaiPelaksanaModel,
        null,
        {
            uuid
        }
    )
}

export const createStatusRiwayatAktivitasDokumenPegawaiPelaksanaRepo = async (statusRiwayatAktivitasDokumenPegawaiPelaksanaData, req_id) => {
    return insertQueryUtil(
        req_id, 
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenPegawaiPelaksanaModel,
        {
            status_riwayat_aktivitas_dokumen: statusRiwayatAktivitasDokumenPegawaiPelaksanaData.status_riwayat_aktivitas_dokumen,
            pegawai_pelaksana: statusRiwayatAktivitasDokumenPegawaiPelaksanaData.pegawai_pelaksana,
            enabled: statusRiwayatAktivitasDokumenPegawaiPelaksanaData.enabled,
        }
    )
}

export const deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        StatusRiwayatAktivitasDokumenPegawaiPelaksanaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo = async (uuid, statusRiwayatAktivitasDokumenPegawaiPelaksanaData) => {
    const statusRiwayatAktivitasDokumenPegawaiPelaksana = await StatusRiwayatAktivitasDokumenPegawaiPelaksanaModel.update({
        status_riwayat_aktivitas_dokumen: statusRiwayatAktivitasDokumenPegawaiPelaksanaData.status_riwayat_aktivitas_dokumen,
        pegawai_pelaksana: statusRiwayatAktivitasDokumenPegawaiPelaksanaData.pegawai_pelaksana,
        enabled: statusRiwayatAktivitasDokumenPegawaiPelaksanaData.enabled,
    }, {
        where: {
            uuid
        }
    })
    return statusRiwayatAktivitasDokumenPegawaiPelaksana
}