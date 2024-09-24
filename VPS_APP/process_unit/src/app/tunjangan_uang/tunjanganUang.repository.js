import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import TunjanganUangModel from "./tunjanganUang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllTunjanganUangRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                tut.bonus + tut.insentif + tut.thr AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Tunjangan Uang" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "dc632a24-dba2-4c65-9b42-968de322fe1c"
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.bonus AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Bonus Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.insentif AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Insentif Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.thr AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "THR Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                tut.jp AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Pensiun Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                tut.jht AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Hari Tua Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                tut.jkm AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Kematian Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                tut.jkk AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Keselamatan Kerja Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.jp AS debet,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Pensiun Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.jht AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Hari Tua Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.jkm AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Kematian Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.jkk AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Keselamatan Kerja Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                tut.bpjs_kesehatan AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "BPJS Kesehatan Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "5555ff3a-9de0-42b5-bdc8-f39c43947496" 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.bpjs_karyawan AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "BPJS Karyawan" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan_bpjs_karyawan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.jp_karyawan AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Pensiun Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan_jp_karyawan
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
            UNION ALL
            SELECT 
                tut.uuid,
                tut.bukti_transaksi,
                0 AS transaksi,
                tut.tanggal,
                0 AS debet,
                tut.jht_karyawan AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                "Jaminan Hari Tua Pegawai" AS uraian,
                "TUNJANGAN UANG PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                tut.enabled 
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan_jht_karyawan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
            WHERE tut.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(tut.tanggal) = "${tahun}" AND MONTH(tut.tanggal) = "${bulan}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
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