import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import HadiahModel from "./hadiah.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllHadiahRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                ht.uuid,
                ht.bukti_transaksi,
                0 AS transaksi,
                ht.tanggal,
                0 AS debet,
                ht.nilai AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                ht.hadiah AS uraian,
                "HADIAH PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                ht.enabled 
            FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ht.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
            WHERE ht.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(ht.tanggal) = ${tahun} AND MONTH(ht.tanggal) = ${bulan}
            UNION ALL 
            SELECT 
                ht.uuid,
                ht.bukti_transaksi,
                0 AS transaksi,
                ht.tanggal,
                ht.nilai AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                ht.hadiah AS uraian,
                "HADIAH PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                ht.enabled 
            FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "a09a5e0c-9544-4a83-b214-c47cf5c07bdd"
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
            WHERE ht.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(ht.tanggal) = ${tahun} AND MONTH(ht.tanggal) = ${bulan}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getHadiahByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        HadiahModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getHadiahByPegawaiUuidRepo = async (uuid, periode, tahun, req_id) => {
    const hadiahs = await db.query(
        `
            SELECT 
                ht.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ht.kode_akun_perkiraan 
            WHERE ht.pegawai = "${uuid}"
            AND ht.enabled = 1
            AND ht.periode = "${periode}"
            AND YEAR(ht.tanggal) = "${tahun}"
            ORDER BY ht.periode ASC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return hadiahs
}

export const createHadiahRepo = async (hadiahData, req_id) => {
    hadiahData = removeDotInRupiahInput(hadiahData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HadiahModel,
        {
            pegawai: hadiahData.pegawai,
            periode: hadiahData.periode,
            kode_akun_perkiraan: hadiahData.kode_akun_perkiraan,
            tanggal: hadiahData.tanggal,
            bukti_transaksi: hadiahData.bukti_transaksi,
            hadiah: hadiahData.hadiah,
            nilai: hadiahData.nilai,
            enabled: hadiahData.enabled
        }
    )
}

export const deleteHadiahByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HadiahModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateHadiahByUuidRepo = async (uuid, hadiahData, req_id) => {
    hadiahData = removeDotInRupiahInput(hadiahData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HadiahModel,
        {
            pegawai: hadiahData.pegawai,
            periode: hadiahData.periode,
            kode_akun_perkiraan: hadiahData.kode_akun_perkiraan,
            tanggal: hadiahData.tanggal,
            bukti_transaksi: hadiahData.bukti_transaksi,
            hadiah: hadiahData.hadiah,
            nilai: hadiahData.nilai,
        },
        {
            uuid
        }
    )
}