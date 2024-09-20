import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Pph2126Model from "./pph2126.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllPph2126Repo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                ppt.uuid,
                ppt.bukti_transaksi,
                0 AS transaksi,
                ppt.tanggal,
                0 AS debet,
                ppt.nilai AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "PPH 21/26 Pegawai" AS uraian,
                "PPH 21/26" AS sumber,
                pt.name AS pegawai_name,
                ppt.enabled 
            FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppt.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
            WHERE pt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(ppt.tanggal) = ${tahun} AND MONTH(ppt.tanggal) = ${bulan}
            UNION ALL
            SELECT 
                ppt.uuid,
                ppt.bukti_transaksi,
                0 AS transaksi,
                ppt.tanggal,
                ppt.nilai AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "PPH 21/26 Pegawai" AS uraian,
                "PPH 21/26" AS sumber,
                pt.name AS pegawai_name,
                ppt.enabled 
            FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "eadfec72-7d66-4597-998d-8acf959d34b7" 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
            WHERE pt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(ppt.tanggal) = ${tahun} AND MONTH(ppt.tanggal) = ${bulan}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getPph2126ByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        Pph2126Model,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getPph2126ByPegawaiUuidRepo = async (uuid, periode, tahun, req_id) => {
    return db.query(
        `
            SELECT 
                pt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.pph2126_tab pt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pt.kode_akun_perkiraan 
            WHERE pt.pegawai = "${uuid}"
            AND pt.enabled = 1
            AND YEAR(pt.tanggal) = "${tahun}"
            AND pt.periode = "${periode}"
            ORDER BY pt.periode ASC
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createPph2126Repo = async (pph2126Data, req_id) => {
    pph2126Data = removeDotInRupiahInput(pph2126Data, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        Pph2126Model,
        {
            pegawai: pph2126Data.pegawai,
            periode: pph2126Data.periode,
            nilai: pph2126Data.nilai,
            tanggal: pph2126Data.tanggal,
            bukti_transaksi: pph2126Data.bukti_transaksi,
            kode_akun_perkiraan: pph2126Data.kode_akun_perkiraan,
            enabled: pph2126Data.enabled
        }
    )
}

export const deletePph2126ByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        Pph2126Model,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePph2126ByUuidRepo = async (uuid, pph2126Data, req_id) => {
    pph2126Data = removeDotInRupiahInput(pph2126Data, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        Pph2126Model,
        {
            pegawai: pph2126Data.pegawai,
            periode: pph2126Data.periode,
            nilai: pph2126Data.nilai,
            tanggal: pph2126Data.tanggal,
            bukti_transaksi: pph2126Data.bukti_transaksi,
            kode_akun_perkiraan: pph2126Data.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}