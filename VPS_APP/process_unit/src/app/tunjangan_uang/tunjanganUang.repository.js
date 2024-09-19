import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import TunjanganUangModel from "./tunjanganUang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllTunjanganUangRepo = async (pageNumber, size, search, req_id) => {
    const tunjanganUangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : tunjanganUangsCount[0].count

    const tunjanganUangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: tunjanganUangs,
        count: tunjanganUangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getTunjanganUangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        TunjanganUangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getTunjanganUangByPegawaiUuidRepo = async (uuid, periode, tahun, req_id) => {
    const tunjanganUangs = await db.query(
        `
            SELECT 
                kapt.code AS kode_akun_perkiraan_code,
                kapt.name AS kode_akun_perkiraan_name,
                kapt2.code AS kode_akun_perkiraan_code_bpjs_karyawan,
                kapt2.name AS kode_akun_perkiraan_name_bpjs_karyawan,
                kapt3.code AS kode_akun_perkiraan_code_jp_karyawan,
                kapt3.name AS kode_akun_perkiraan_name_jp_karyawan,
                kapt4.code AS kode_akun_perkiraan_code_jht_karyawan,
                kapt4.name AS kode_akun_perkiraan_name_jht_karyawan,
                gt.bukti_transaksi AS gaji_bukti_transaksi,
                gt.nilai AS gaji_nilai,
                tut.*
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt2 ON kapt2.uuid = tut.kode_akun_perkiraan_bpjs_karyawan 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt3 ON kapt3.uuid = tut.kode_akun_perkiraan_jp_karyawan 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt4 ON kapt4.uuid = tut.kode_akun_perkiraan_jht_karyawan 
            JOIN ${generateDatabaseName(req_id)}.gaji_tab gt ON gt.uuid = tut.gaji 
            WHERE tut.pegawai = "${uuid}"
            AND tut.enabled = 1
            AND kapt.enabled = 1
            AND kapt2.enabled = 1
            AND kapt3.enabled = 1
            AND kapt4.enabled = 1
            AND gt.enabled = 1
            AND tut.periode = "${periode}"
            AND YEAR(tut.tanggal) = "${tahun}"
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return tunjanganUangs
}

export const createTunjanganUangRepo = async (tunjanganUangData, req_id) => {
    tunjanganUangData = removeDotInRupiahInput(tunjanganUangData, [
        "bonus",
        "insentif",
        "thr"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TunjanganUangModel,
        {
            pegawai: tunjanganUangData.pegawai,
            periode: tunjanganUangData.periode,
            gaji: tunjanganUangData.gaji,
            kode_akun_perkiraan: tunjanganUangData.kode_akun_perkiraan,
            tanggal: tunjanganUangData.tanggal,
            bukti_transaksi: tunjanganUangData.bukti_transaksi,
            bonus: tunjanganUangData.bonus,
            insentif: tunjanganUangData.insentif,
            thr: tunjanganUangData.thr,
            bpjs_kesehatan: tunjanganUangData.bpjs_kesehatan,
            bpjs_kesehatan_persentase: tunjanganUangData.bpjs_kesehatan_persentase,
            jkk: tunjanganUangData.jkk,
            jkk_persentase: tunjanganUangData.jkk_persentase,
            jkm: tunjanganUangData.jkm,
            jkm_persentase: tunjanganUangData.jkm_persentase,
            jht: tunjanganUangData.jht,
            jht_persentase: tunjanganUangData.jht_persentase,
            jp: tunjanganUangData.jp,
            jp_persentase: tunjanganUangData.jp_persentase,
            bpjs_karyawan: tunjanganUangData.bpjs_karyawan,
            bpjs_karyawan_persentase: tunjanganUangData.bpjs_karyawan_persentase,
            kode_akun_perkiraan_bpjs_karyawan: tunjanganUangData.kode_akun_perkiraan_bpjs_karyawan,
            jp_karyawan: tunjanganUangData.jp_karyawan,
            jp_karyawan_persentase: tunjanganUangData.jp_karyawan_persentase,
            kode_akun_perkiraan_jp_karyawan: tunjanganUangData.kode_akun_perkiraan_jp_karyawan,
            jht_karyawan: tunjanganUangData.jht_karyawan,
            jht_karyawan_persentase: tunjanganUangData.jht_karyawan_persentase,
            kode_akun_perkiraan_jht_karyawan: tunjanganUangData.kode_akun_perkiraan_jht_karyawan,
            enabled: tunjanganUangData.enabled
        }
    )
}

export const deleteTunjanganUangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TunjanganUangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateTunjanganUangByUuidRepo = async (uuid, tunjanganUangData, req_id) => {
    tunjanganUangData = removeDotInRupiahInput(tunjanganUangData, [
        "bonus",
        "insentif",
        "thr"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TunjanganUangModel,
        {
            pegawai: tunjanganUangData.pegawai,
            periode: tunjanganUangData.periode,
            gaji: tunjanganUangData.gaji,
            kode_akun_perkiraan: tunjanganUangData.kode_akun_perkiraan,
            tanggal: tunjanganUangData.tanggal,
            bukti_transaksi: tunjanganUangData.bukti_transaksi,
            bonus: tunjanganUangData.bonus,
            insentif: tunjanganUangData.insentif,
            thr: tunjanganUangData.thr,
            bpjs_kesehatan: tunjanganUangData.bpjs_kesehatan,
            bpjs_kesehatan_persentase: tunjanganUangData.bpjs_kesehatan_persentase,
            jkk: tunjanganUangData.jkk,
            jkk_persentase: tunjanganUangData.jkk_persentase,
            jkm: tunjanganUangData.jkm,
            jkm_persentase: tunjanganUangData.jkm_persentase,
            jht: tunjanganUangData.jht,
            jht_persentase: tunjanganUangData.jht_persentase,
            jp: tunjanganUangData.jp,
            jp_persentase: tunjanganUangData.jp_persentase,
            bpjs_karyawan: tunjanganUangData.bpjs_karyawan,
            bpjs_karyawan_persentase: tunjanganUangData.bpjs_karyawan_persentase,
            kode_akun_perkiraan_bpjs_karyawan: tunjanganUangData.kode_akun_perkiraan_bpjs_karyawan,
            jp_karyawan: tunjanganUangData.jp_karyawan,
            jp_karyawan_persentase: tunjanganUangData.jp_karyawan_persentase,
            kode_akun_perkiraan_jp_karyawan: tunjanganUangData.kode_akun_perkiraan_jp_karyawan,
            jht_karyawan: tunjanganUangData.jht_karyawan,
            jht_karyawan_persentase: tunjanganUangData.jht_karyawan_persentase,
            kode_akun_perkiraan_jht_karyawan: tunjanganUangData.kode_akun_perkiraan_jht_karyawan,
        },
        {
            uuid
        }
    )
}