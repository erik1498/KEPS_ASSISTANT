import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import LemburModel from "./lembur.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllLemburRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                lt.uuid,
                lt.bukti_transaksi,
                0 AS transaksi,
                lt.tanggal,
                0 AS debet,
                lt.total_bayaran AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "" AS uraian,
                lt.deskripsi_kerja,
                lt.keterangan_kerja,
                "LEMBUR PEGAWAI" AS sumber,
                lt.waktu_mulai,
                lt.waktu_selesai,
                lt.total_jam,
                lt.total_menit,
                lt.nilai_lembur_per_menit,
                pt.name AS pegawai_name,
                lt.periode AS periode,
                lt.enabled 
            FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = lt.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = lt.pegawai 
            WHERE lt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(lt.tanggal) = ${tahun} AND MONTH(lt.tanggal) = ${bulan}
            UNION ALL
            SELECT 
                lt.uuid,
                lt.bukti_transaksi,
                1 AS transaksi,
                lt.tanggal,
                lt.total_bayaran AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "" AS uraian,
                lt.deskripsi_kerja,
                lt.keterangan_kerja,
                "LEMBUR PEGAWAI" AS sumber,
                lt.waktu_mulai,
                lt.waktu_selesai,
                lt.total_jam,
                lt.total_menit,
                lt.nilai_lembur_per_menit,
                pt.name AS pegawai_name,
                lt.periode AS periode,
                lt.enabled 
            FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "96dc1c2e-1cd3-42b8-b580-3932ebe1e82d"
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = lt.pegawai 
            WHERE lt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(lt.tanggal) = ${tahun} AND MONTH(lt.tanggal) = ${bulan}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getLemburByPegawaiUuidRepo = async (uuid, periode, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                lt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = lt.kode_akun_perkiraan 
            WHERE lt.pegawai = "${uuid}"
            AND lt.enabled = 1
            AND lt.periode = "${periode}"
            AND YEAR(lt.tanggal) = "${tahun}"
            ORDER BY lt.periode ASC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getLemburByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        LemburModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createLemburRepo = async (lemburData, req_id) => {
    lemburData = removeDotInRupiahInput(lemburData, [
        "nilai_lembur_per_menit",
        "total_jam",
        "total_menit",
        "total_bayaran"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LemburModel,
        {
            pegawai: lemburData.pegawai,
            periode: lemburData.periode,
            kode_akun_perkiraan: lemburData.kode_akun_perkiraan,
            tanggal: lemburData.tanggal,
            bukti_transaksi: lemburData.bukti_transaksi,
            deskripsi_kerja: lemburData.deskripsi_kerja,
            keterangan_kerja: lemburData.keterangan_kerja,
            nilai_lembur_per_menit: lemburData.nilai_lembur_per_menit,
            waktu_mulai: lemburData.waktu_mulai,
            waktu_selesai: lemburData.waktu_selesai,
            total_jam: lemburData.total_jam,
            total_menit: lemburData.total_menit,
            total_bayaran: lemburData.total_bayaran,
            enabled: lemburData.enabled
        }
    )
}

export const deleteLemburByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LemburModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateLemburByUuidRepo = async (uuid, lemburData, req_id) => {
    lemburData = removeDotInRupiahInput(lemburData, [
        "nilai_lembur_per_menit",
        "total_jam",
        "total_menit",
        "total_bayaran"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LemburModel,
        {
            pegawai: lemburData.pegawai,
            periode: lemburData.periode,
            kode_akun_perkiraan: lemburData.kode_akun_perkiraan,
            tanggal: lemburData.tanggal,
            bukti_transaksi: lemburData.bukti_transaksi,
            deskripsi_kerja: lemburData.deskripsi_kerja,
            keterangan_kerja: lemburData.keterangan_kerja,
            nilai_lembur_per_menit: lemburData.nilai_lembur_per_menit,
            waktu_mulai: lemburData.waktu_mulai,
            waktu_selesai: lemburData.waktu_selesai,
            total_jam: lemburData.total_jam,
            total_menit: lemburData.total_menit,
            total_bayaran: lemburData.total_bayaran,
        },
        {
            uuid
        }
    )
}