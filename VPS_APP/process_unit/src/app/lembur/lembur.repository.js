import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import LemburModel from "./lembur.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllLemburRepo = async (pageNumber, size, search, req_id) => {
    const lembursCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.lembur_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : lembursCount[0].count

    const lemburs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.lembur_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: lemburs,
        count: lembursCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
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