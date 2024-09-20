import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import LainLainModel from "./lainLain.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllLainLainRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                llt.uuid,
                llt.bukti_transaksi,
                0 AS transaksi,
                llt.tanggal,
                0 AS debet,
                llt.nilai AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                llt.keterangan AS uraian,
                "LAIN - LAIN" AS sumber,
                pt.name AS pegawai_name,
                llt.enabled 
            FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = llt.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
            WHERE llt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(llt.tanggal) = ${tahun} AND MONTH(llt.tanggal) = ${bulan}
            UNION ALL
            SELECT 
                llt.uuid,
                llt.bukti_transaksi,
                0 AS transaksi,
                llt.tanggal,
                llt.nilai AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                llt.keterangan AS uraian,
                "LAIN - LAIN" AS sumber,
                pt.name AS pegawai_name,
                llt.enabled 
            FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "b7687ceb-6046-4062-979d-bfed5550bd87"
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
            WHERE llt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(llt.tanggal) = ${tahun} AND MONTH(llt.tanggal) = ${bulan}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getLainLainByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        LainLainModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getLainLainByPegawaiUUIDRepo = async (uuid, periode, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                llt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = llt.kode_akun_perkiraan 
            WHERE llt.pegawai = "${uuid}"
            AND llt.enabled = 1
            AND YEAR(llt.tanggal) = "${tahun}"
            AND llt.periode = "${periode}"
            ORDER BY llt.periode ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const createLainLainRepo = async (lainLainData, req_id) => {
    lainLainData = removeDotInRupiahInput(lainLainData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LainLainModel,
        {
            pegawai: lainLainData.pegawai,
            periode: lainLainData.periode,
            nilai: lainLainData.nilai,
            tanggal: lainLainData.tanggal,
            bukti_transaksi: lainLainData.bukti_transaksi,
            keterangan: lainLainData.keterangan,
            kode_akun_perkiraan: lainLainData.kode_akun_perkiraan,
            enabled: lainLainData.enabled
        }
    )
}

export const deleteLainLainByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LainLainModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateLainLainByUuidRepo = async (uuid, lainLainData, req_id) => {
    lainLainData = removeDotInRupiahInput(lainLainData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LainLainModel,
        {
            pegawai: lainLainData.pegawai,
            periode: lainLainData.periode,
            nilai: lainLainData.nilai,
            tanggal: lainLainData.tanggal,
            bukti_transaksi: lainLainData.bukti_transaksi,
            keterangan: lainLainData.keterangan,
            kode_akun_perkiraan: lainLainData.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}