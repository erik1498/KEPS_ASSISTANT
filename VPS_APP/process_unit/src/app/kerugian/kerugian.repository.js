import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KerugianModel from "./kerugian.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllKerugianRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                kt.uuid,
                kt.bukti_transaksi,
                0 AS transaksi,
                kt.tanggal,
                0 AS debet,
                kt.nilai AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                kt.keterangan AS uraian,
                "KERUGIAN" AS sumber,
                pt.name AS pegawai_name,
                kt.periode AS periode,
                kt.enabled 
            FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kt.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
            WHERE kt.enabled = 1
            AND kapt.enabled = 1
            AND pt.enabled = 1
            AND YEAR(kt.tanggal) = ${tahun} AND MONTH(kt.tanggal) = ${bulan}
            UNION ALL
            SELECT 
                kt.uuid,
                kt.bukti_transaksi,
                0 AS transaksi,
                kt.tanggal,
                kt.nilai AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                kt.keterangan AS uraian,
                "KERUGIAN" AS sumber,
                pt.name AS pegawai_name,
                kt.periode AS periode,
                kt.enabled 
            FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "f3eafc29-6a1c-4e57-b789-532b490dac33"
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
            WHERE kt.enabled = 1
            AND kapt.enabled = 1
            AND pt.enabled = 1
            AND YEAR(kt.tanggal) = ${tahun} AND MONTH(kt.tanggal) = ${bulan}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getKerugianByPegawaiUUIDRepo = async (uuid, periode, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                kt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kt.kode_akun_perkiraan 
            WHERE kt.pegawai = "${uuid}"
            AND kt.enabled = 1
            AND YEAR(kt.tanggal) = "${tahun}"
            AND kt.periode = "${periode}"
            ORDER BY kt.periode ASC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getKerugianByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KerugianModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKerugianRepo = async (kerugianData, req_id) => {
    kerugianData = removeDotInRupiahInput(kerugianData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KerugianModel,
        {
            pegawai: kerugianData.pegawai,
            periode: kerugianData.periode,
            nilai: kerugianData.nilai,
            tanggal: kerugianData.tanggal,
            bukti_transaksi: kerugianData.bukti_transaksi,
            keterangan: kerugianData.keterangan,
            kode_akun_perkiraan: kerugianData.kode_akun_perkiraan,
            enabled: kerugianData.enabled
        }
    )
}

export const deleteKerugianByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KerugianModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKerugianByUuidRepo = async (uuid, kerugianData, req_id) => {
    kerugianData = removeDotInRupiahInput(kerugianData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KerugianModel,
        {
            pegawai: kerugianData.pegawai,
            periode: kerugianData.periode,
            nilai: kerugianData.nilai,
            tanggal: kerugianData.tanggal,
            bukti_transaksi: kerugianData.bukti_transaksi,
            keterangan: kerugianData.keterangan,
            kode_akun_perkiraan: kerugianData.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}