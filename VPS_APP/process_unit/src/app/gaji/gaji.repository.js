import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import GajiModel from "./gaji.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllGajiRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                gt.uuid,
                gt.bukti_transaksi,
                0 AS transaksi,
                gt.tanggal,
                0 AS debet,
                gt.nilai AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                CONCAT("Gaji Pegawai") AS uraian,
                "GAJI PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                gt.enabled 
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = gt.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
            WHERE gt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(gt.tanggal) = ${tahun} AND MONTH(gt.tanggal) = ${bulan}
            UNION ALL 
            SELECT 
                gt.uuid,
                gt.bukti_transaksi,
                0 AS transaksi,
                gt.tanggal,
                gt.nilai AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                CONCAT("Gaji Pegawai") AS uraian,
                "GAJI PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                gt.enabled 
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "0c0a1c04-ad98-4818-9a63-9be554b2ae55" 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
            WHERE gt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(gt.tanggal) = ${tahun} AND MONTH(gt.tanggal) = ${bulan}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}


export const getGajiByPegawaiUuidRepo = async (uuid, periode, tahun, req_id) => {
    const gajis = await db.query(
        `
            SELECT 
                gt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = gt.kode_akun_perkiraan 
            WHERE gt.pegawai = "${uuid}"
            AND gt.enabled = 1
            AND YEAR(gt.tanggal) = "${tahun}"
            AND gt.periode = "${periode}"
            ORDER BY gt.periode ASC
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return gajis
}

export const getGajiByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        GajiModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createGajiRepo = async (gajiData, req_id) => {
    gajiData = removeDotInRupiahInput(gajiData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        GajiModel,
        {
            pegawai: gajiData.pegawai,
            periode: gajiData.periode,
            kode_akun_perkiraan: gajiData.kode_akun_perkiraan,
            bukti_transaksi: gajiData.bukti_transaksi,
            tanggal: gajiData.tanggal,
            nilai: gajiData.nilai,
            enabled: gajiData.enabled
        }
    )
}

export const deleteGajiByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        GajiModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateGajiByUuidRepo = async (uuid, gajiData, req_id) => {
    gajiData = removeDotInRupiahInput(gajiData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        GajiModel,
        {
            pegawai: gajiData.pegawai,
            periode: gajiData.periode,
            kode_akun_perkiraan: gajiData.kode_akun_perkiraan,
            bukti_transaksi: gajiData.bukti_transaksi,
            tanggal: gajiData.tanggal,
            nilai: gajiData.nilai,
        },
        {
            uuid
        }
    )
}