import { Sequelize, where } from "sequelize";
import db from "../../config/Database.js";
import JurnalUmumModel from "./jurnalUmum.model.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getJurnalUmumByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        JurnalUmumModel,
        null,
        {
            uuid
        }
    )
}

export const getJurnalUmumNeracaByBulanRepo = async (bulan, req_id) => {
    bulan = bulan < 10 ? "0" + bulan : bulan
    const jurnalUmums = await db.query(
        `
            SELECT 
                jurnal_umum_tab.*,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun 
            FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON jut.kode_akun_uuid = kapt.uuid
            WHERE jut.bulan = :bulan AND jut.tahun = :tahun
            AND kapt.type IN ("Harta", "Utang", "Modal")
        `,
        {
            replacements: {
                bulan,
                tahun: `${new Date().getFullYear()}`
            },
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return jurnalUmums
}

export const getJurnalUmumLabaRugiByBulanRepo = async (bulan, req_id) => {
    bulan = bulan < 10 ? "0" + bulan : bulan
    const jurnalUmums = await db.query(
        `
            SELECT 
                jut.*,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun 
            FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab.jut 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON jut.kode_akun_uuid = kapt.uuid
            WHERE jut.bulan = :bulan AND jut.tahun = :tahun
            AND kapt.type IN ("Pendapatan", "Beban")
        `,
        {
            replacements: {
                tahun: `${new Date().getFullYear()}`,
                bulan
            },
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return jurnalUmums
}

export const getJurnalUmumByBulanRepo = async (bulan, tahun, search, sorting, req_id) => {
    bulan = bulan < 10 ? "0" + bulan : bulan
    const jurnalUmums = await db.query(
        `
                SELECT 
                    res.*
                FROM
                (
                    SELECT 
                        jut.uuid,
                        jut.bukti_transaksi,
                        jut.transaksi,
                        jut.tanggal,
                        jut.bulan,
                        jut.tahun,
                        jut.waktu,
                        jut.debet,
                        jut.kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        jut.uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "JURNAL UMUM" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        0 AS periode,
                        jut.enabled
                    FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = jut.kode_akun_uuid
                    WHERE kapt.enabled = 1 AND jut.enabled = 1
                    UNION ALL -- TRANSAKSI BANK START
                    SELECT 
                        tkt.uuid,
                        tkt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tkt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tkt.tanggal), 2, '0') AS bulan,
                        YEAR(tkt.tanggal) AS tahun,
                        TIME(tkt.tanggal) AS waktu,
                        CASE 
                            WHEN tkt.type = 1
                            THEN tkt.nilai
                            ELSE 0
                        END AS debet,
                        CASE 
                            WHEN tkt.type = 0
                            THEN tkt.nilai
                            ELSE 0
                        END AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        tkt.uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TRANSAKSI KAS" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        0 AS periode,
                        tkt.enabled 
                    FROM ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tkt.kode_akun_perkiraan 
                    WHERE tkt.enabled = 1
                    UNION ALL
                    SELECT 
                        rtkt.uuid,
                        tkt.bukti_transaksi,
                        1 AS transaksi,
                        LPAD(DAY(tkt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tkt.tanggal), 2, '0') AS bulan,
                        YEAR(tkt.tanggal) AS tahun,
                        rtkt.waktu,
                        CASE 
                            WHEN tkt.type = 0
                            THEN rtkt.nilai
                            ELSE 0
                        END AS debet,
                        CASE 
                            WHEN tkt.type = 1
                            THEN rtkt.nilai
                            ELSE 0
                        END AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        rtkt.uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TRANSAKSI KAS" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        0 AS periode,
                        rtkt.enabled 
                    FROM ${generateDatabaseName(req_id)}.rincian_transaksi_kas_tab rtkt 
                    JOIN ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt ON tkt.uuid = rtkt.transaksi_kas 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtkt.kode_akun_perkiraan 
                    WHERE rtkt.enabled = 1 AND tkt.enabled = 1
                    UNION ALL -- TRANSAKSI KAS START
                    SELECT 
                        tbt.uuid,
                        tbt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tbt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tbt.tanggal), 2, '0') AS bulan,
                        YEAR(tbt.tanggal) AS tahun,
                        TIME(tbt.tanggal) AS waktu,
                        CASE 
                            WHEN tbt.type = 1
                            THEN tbt.nilai
                            ELSE 0
                        END AS debet,
                        CASE 
                            WHEN tbt.type = 0
                            THEN tbt.nilai
                            ELSE 0
                        END AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        tbt.uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TRANSAKSI BANK" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        0 AS periode,
                        tbt.enabled 
                    FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tbt.kode_akun_perkiraan 
                    WHERE tbt.enabled = 1
                    UNION ALL
                    SELECT 
                        rtbt.uuid,
                        tbt.bukti_transaksi,
                        1 AS transaksi,
                        LPAD(DAY(tbt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tbt.tanggal), 2, '0') AS bulan,
                        YEAR(tbt.tanggal) AS tahun,
                        rtbt.waktu,
                        CASE 
                            WHEN tbt.type = 0
                            THEN rtbt.nilai
                            ELSE 0
                        END AS debet,
                        CASE 
                            WHEN tbt.type = 1
                            THEN rtbt.nilai
                            ELSE 0
                        END AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        rtbt.uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TRANSAKSI BANK" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        0 AS periode,
                        rtbt.enabled 
                    FROM ${generateDatabaseName(req_id)}.rincian_transaksi_bank_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt ON tbt.uuid = rtbt.transaksi_bank 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtbt.kode_akun_perkiraan 
                    WHERE rtbt.enabled = 1 AND tbt.enabled = 1
                    UNION ALL -- GAJI PEGAWAI START
                    SELECT 
                        gt.uuid,
                        gt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(gt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(gt.tanggal), 2, '0') AS bulan,
                        YEAR(gt.tanggal) AS tahun,
                        TIME(gt.tanggal) AS waktu,
                        0 AS debet,
                        gt.nilai AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Gaji Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "GAJI PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        gt.periode AS periode,
                        gt.enabled 
                    FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = gt.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
                    WHERE gt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL 
                    SELECT 
                        gt.uuid,
                        gt.bukti_transaksi,
                        1 AS transaksi,
                        LPAD(DAY(gt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(gt.tanggal), 2, '0') AS bulan,
                        YEAR(gt.tanggal) AS tahun,
                        TIME(gt.tanggal) AS waktu,
                        gt.nilai AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Gaji Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "GAJI PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        gt.periode AS periode,
                        gt.enabled 
                    FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "0c0a1c04-ad98-4818-9a63-9be554b2ae55" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
                    WHERE gt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL -- TUNJANGAN UANG START
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        tut.bonus + tut.insentif + tut.thr AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Tunjangan Uang" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "dc632a24-dba2-4c65-9b42-968de322fe1c"
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.bonus AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Bonus Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.insentif AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Insentif Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.thr AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "THR Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        tut.jp AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Pensiun Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        tut.jht AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Hari Tua Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        tut.jkm AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Kematian Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        tut.jkk AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Keselamatan Kerja Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.jp AS debet,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Pensiun Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.jht AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Hari Tua Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.jkm AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Kematian Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.jkk AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Keselamatan Kerja Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        tut.bpjs_kesehatan AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "BPJS Kesehatan Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "5555ff3a-9de0-42b5-bdc8-f39c43947496" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.bpjs_karyawan AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "BPJS Karyawan" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.jp_karyawan AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Pensiun Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262"
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        tut.uuid,
                        tut.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
                        YEAR(tut.tanggal) AS tahun,
                        TIME(tut.tanggal) AS waktu,
                        0 AS debet,
                        tut.jht_karyawan AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "Jaminan Hari Tua Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "TUNJANGAN UANG PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        tut.periode AS periode,
                        tut.enabled 
                    FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                    WHERE tut.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL -- LEMBUR START
                    SELECT 
                        lt.uuid,
                        lt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(lt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(lt.tanggal), 2, '0') AS bulan,
                        YEAR(lt.tanggal) AS tahun,
                        TIME(lt.tanggal) AS waktu,
                        0 AS debet,
                        lt.total_bayaran AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        NULL AS uraian,
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
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        lt.uuid,
                        lt.bukti_transaksi,
                        1 AS transaksi,
                        LPAD(DAY(lt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(lt.tanggal), 2, '0') AS bulan,
                        YEAR(lt.tanggal) AS tahun,
                        TIME(lt.tanggal) AS waktu,
                        lt.total_bayaran AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        NULL AS uraian,
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
                    AND pt.enabled = 1
                    UNION ALL -- HADIAH START
                    SELECT 
                        ht.uuid,
                        ht.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(ht.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(ht.tanggal), 2, '0') AS bulan,
                        YEAR(ht.tanggal) AS tahun,
                        TIME(ht.tanggal) AS waktu,
                        0 AS debet,
                        ht.nilai AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        ht.hadiah AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "HADIAH PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        ht.periode AS periode,
                        ht.enabled 
                    FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ht.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
                    WHERE ht.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL 
                    SELECT 
                        ht.uuid,
                        ht.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(ht.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(ht.tanggal), 2, '0') AS bulan,
                        YEAR(ht.tanggal) AS tahun,
                        TIME(ht.tanggal) AS waktu,
                        ht.nilai AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        ht.hadiah AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "HADIAH PEGAWAI" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        ht.periode AS periode,
                        ht.enabled 
                    FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "a09a5e0c-9544-4a83-b214-c47cf5c07bdd"
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
                    WHERE ht.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL -- PPH2126 START
                    SELECT 
                        ppt.uuid,
                        ppt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(ppt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(ppt.tanggal), 2, '0') AS bulan,
                        YEAR(ppt.tanggal) AS tahun,
                        TIME(ppt.tanggal) AS waktu,
                        0 AS debet,
                        ppt.nilai AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "PPH 21/26 Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "PPH 21/26" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        ppt.periode AS periode,
                        ppt.enabled 
                    FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppt.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
                    WHERE pt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        ppt.uuid,
                        ppt.bukti_transaksi,
                        1 AS transaksi,
                        LPAD(DAY(ppt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(ppt.tanggal), 2, '0') AS bulan,
                        YEAR(ppt.tanggal) AS tahun,
                        TIME(ppt.tanggal) AS waktu,
                        ppt.nilai AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        "PPH 21/26 Pegawai" AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "PPH 21/26" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        ppt.periode AS periode,
                        ppt.enabled 
                    FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "eadfec72-7d66-4597-998d-8acf959d34b7" 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
                    WHERE pt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL -- LAIN LAIN START
                    SELECT 
                        llt.uuid,
                        llt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(llt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(llt.tanggal), 2, '0') AS bulan,
                        YEAR(llt.tanggal) AS tahun,
                        TIME(llt.tanggal) AS waktu,
                        0 AS debet,
                        llt.nilai AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        llt.keterangan AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "LAIN - LAIN" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        llt.periode AS periode,
                        llt.enabled 
                    FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = llt.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
                    WHERE llt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        llt.uuid,
                        llt.bukti_transaksi,
                        1 AS transaksi,
                        LPAD(DAY(llt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(llt.tanggal), 2, '0') AS bulan,
                        YEAR(llt.tanggal) AS tahun,
                        TIME(llt.tanggal) AS waktu,
                        llt.nilai AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        llt.keterangan AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "LAIN - LAIN" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        llt.periode AS periode,
                        llt.enabled 
                    FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "b7687ceb-6046-4062-979d-bfed5550bd87"
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
                    WHERE llt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL -- KERUGIAN START
                    SELECT 
                        kt.uuid,
                        kt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(kt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(kt.tanggal), 2, '0') AS bulan,
                        YEAR(kt.tanggal) AS tahun,
                        TIME(kt.tanggal) AS waktu,
                        0 AS debet,
                        kt.nilai AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        kt.keterangan AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "KERUGIAN" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        kt.periode AS periode,
                        kt.enabled 
                    FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kt.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
                    WHERE kt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        kt.uuid,
                        kt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(kt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(kt.tanggal), 2, '0') AS bulan,
                        YEAR(kt.tanggal) AS tahun,
                        TIME(kt.tanggal) AS waktu,
                        kt.nilai AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        kt.keterangan AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "KERUGIAN" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        kt.periode AS periode,
                        kt.enabled 
                    FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "f3eafc29-6a1c-4e57-b789-532b490dac33"
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
                    WHERE kt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL -- PIUTANG PEGAWAI START
                    SELECT 
                        pkt.uuid,
                        pkt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(pkt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(pkt.tanggal), 2, '0') AS bulan,
                        YEAR(pkt.tanggal) AS tahun,
                        TIME(pkt.tanggal) AS waktu,
                        CASE 
                            WHEN pkt.type = 0
                            THEN pkt.nilai
                            ELSE 0
                        END AS debet,
                        CASE 
                            WHEN pkt.type = 1
                            THEN pkt.nilai
                            ELSE 0
                        END AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        pkt.keterangan AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "PIUTANG KARYAWAN" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        pkt.periode AS periode,
                        pkt.enabled 
                    FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pkt.kode_akun_perkiraan 
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
                    WHERE pkt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        pkt.uuid,
                        pkt.bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(pkt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(pkt.tanggal), 2, '0') AS bulan,
                        YEAR(pkt.tanggal) AS tahun,
                        TIME(pkt.tanggal) AS waktu,
                        CASE 
                            WHEN pkt.type = 1
                            THEN pkt.nilai
                            ELSE 0
                        END AS debet,
                        CASE 
                            WHEN pkt.type = 0
                            THEN pkt.nilai
                            ELSE 0
                        END AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        pkt.keterangan AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "PIUTANG KARYAWAN" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        pt.name AS pegawai_name,
                        pkt.periode AS periode,
                        pkt.enabled 
                    FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "f15e2810-c736-42f6-9a80-6d70e03315de"
                    JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
                    WHERE pkt.enabled = 1
                    AND kapt.enabled = 1
                    AND pt.enabled = 1
                    UNION ALL
                    SELECT 
                        psojt.uuid,
                        psojt.bukti_transaksi,
                        psojt.transaksi,
                        LPAD(DAY(psojt.tanggal), 2, '0') AS tanggal,
                        LPAD(MONTH(psojt.tanggal), 2, '0') AS bulan,
                        YEAR(psojt.tanggal) AS tahun,
                        TIME(psojt.tanggal) AS waktu,
                        psojt.debet,
                        psojt.kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        JSON_OBJECT(
                            'detail', psojt.detail_data
                        ) AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        psojt.sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        NULL AS periode,
                        psojt.enabled 
                    FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab psojt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = psojt.kode_akun_perkiraan 
                    WHERE psojt.enabled = 1
                    UNION ALL -- JURNAL PENYUSUTAN ASET
                    SELECT 
                        "NOT_AVAILABLE" AS uuid,
                        dpt.bukti_transaksi AS bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(dpt.tanggal_beli), 2, '0') AS tanggal,
                        LPAD(MONTH(dpt.tanggal_beli), 2, '0') AS bulan,
                        YEAR(dpt.tanggal_beli) AS tahun,
                        TIME(dpt.tanggal_beli) AS waktu,
                        dpt.kuantitas * dpt.harga_satuan AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        JSON_OBJECT(
                            'detail', JSON_OBJECT (
                                'satuan_barang_name', sbt.name,
                                'kuantitas', dpt.kuantitas,
                                'harga_satuan', dpt.harga_satuan,
                                'dpp', dpt.dpp,
                                'ppn', dpt.ppn,
                                'kategori_perlengkaan', kpt.name,
                                'supplier_name', st.name,
                                'supplier_code', st.code,
                                'daftar_perlengkapan_name', dpt.name,
                                'daftar_perlengkapan_invoice', dpt.nomor_invoice
                            )
                        ) AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "PEMBELIAN PERLENGKAPAN" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        NULL AS periode,
                        dpt.enabled
                    FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
                    JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dpt.supplier 
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dpt.satuan_barang 
                    JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kpt ON kpt.uuid = dpt.kategori_perlengkapan 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kpt.kode_akun_perkiraan 
                    AND dpt.enabled = 1
                    UNION ALL
                    SELECT 
                        "NOT_AVAILABLE" AS uuid,
                        dpt.bukti_transaksi AS bukti_transaksi,
                        1 AS transaksi,
                        LPAD(DAY(dpt.tanggal_beli), 2, '0') AS tanggal,
                        LPAD(MONTH(dpt.tanggal_beli), 2, '0') AS bulan,
                        YEAR(dpt.tanggal_beli) AS tahun,
                        TIME(dpt.tanggal_beli) AS waktu,
                        0 AS debet,
                        dpt.kuantitas * dpt.harga_satuan AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        JSON_OBJECT(
                            'detail', JSON_OBJECT (
                                'satuan_barang_name', sbt.name,
                                'kuantitas', dpt.kuantitas,
                                'harga_satuan', dpt.harga_satuan,
                                'dpp', dpt.dpp,
                                'ppn', dpt.ppn,
                                'kategori_perlengkaan', kpt.name,
                                'supplier_name', st.name,
                                'supplier_code', st.code,
                                'daftar_perlengkapan_name', dpt.name,
                                'daftar_perlengkapan_invoice', dpt.nomor_invoice
                            )
                        ) AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "PEMBELIAN PERLENGKAPAN" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        NULL AS periode,
                        dpt.enabled
                    FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
                    JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dpt.supplier 
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dpt.satuan_barang 
                    JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kpt ON kpt.uuid = dpt.kategori_perlengkapan 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = dpt.kode_akun_perkiraan 
                    AND dpt.enabled = 1
                    UNION ALL
                    SELECT 
                        "NOT_AVAILABLE" AS uuid,
                        dat.bukti_transaksi AS bukti_transaksi,
                        0 AS transaksi,
                        LPAD(DAY(dat.tanggal_beli), 2, '0') AS tanggal,
                        LPAD(MONTH(dat.tanggal_beli), 2, '0') AS bulan,
                        YEAR(dat.tanggal_beli) AS tahun,
                        TIME(dat.tanggal_beli) AS waktu,
                        dat.harga_satuan * dat.kuantitas AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        JSON_OBJECT(
                            'detail', JSON_OBJECT (
                                'satuan_barang_name', sbt.name,
                                'kuantitas', dat.kuantitas,
                                'harga_satuan', dat.harga_satuan,
                                'dpp', dat.dpp,
                                'ppn', dat.ppn,
                                'metode_penyusutan', mpt.name,
                                'kelompok_aset', kat.name,
                                'kategori_aset', kat2.name,
                                'supplier_name', st.name,
                                'supplier_code', st.code,
                                'daftar_aset_name', dat.name,
                                'daftar_aset_invoice', dat.nomor_invoice
                            )
                        ) AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "PEMBELIAN ASET" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        NULL AS periode,
                        dat.enabled
                    FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                    JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                    JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                    JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                    JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kat2.kode_akun_perkiraan_debet
                    AND dat.enabled = 1
                    UNION ALL
                    SELECT 
                        "NOT_AVAILABLE" AS uuid,
                        dat.bukti_transaksi AS bukti_transaksi,
                        1 AS transaksi,
                        LPAD(DAY(dat.tanggal_beli), 2, '0') AS tanggal,
                        LPAD(MONTH(dat.tanggal_beli), 2, '0') AS bulan,
                        YEAR(dat.tanggal_beli) AS tahun,
                        TIME(dat.tanggal_beli) AS waktu,
                        0 AS debet,
                        dat.harga_satuan * dat.kuantitas AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        JSON_OBJECT(
                            'detail', JSON_OBJECT (
                                'satuan_barang_name', sbt.name,
                                'kuantitas', dat.kuantitas,
                                'harga_satuan', dat.harga_satuan,
                                'dpp', dat.dpp,
                                'ppn', dat.ppn,
                                'metode_penyusutan', mpt.name,
                                'kelompok_aset', kat.name,
                                'kategori_aset', kat2.name,
                                'supplier_name', st.name,
                                'supplier_code', st.code,
                                'daftar_aset_name', dat.name,
                                'daftar_aset_invoice', dat.nomor_invoice
                            )
                        ) AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "PEMBELIAN ASET" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        NULL AS periode,
                        dat.enabled
                    FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat 
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                    JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                    JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                    JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                    JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = dat.kode_akun_perkiraan
                    AND dat.enabled = 1
                    UNION ALL
                    SELECT 
                        "NOT_AVAILABLE" AS uuid,
                        CONCAT("HP", dat.nomor_invoice) AS bukti_transaksi,
                        0 AS transaksi,
                        LPAD(hpt.tanggal, 2, '0') AS tanggal,
                        LPAD(hpt.bulan, 2, '0') AS bulan,
                        hpt.tahun AS tahun,
                        TIME(dat.tanggal_beli) AS waktu,
                        CASE
                            WHEN hpt.nilai_penyusutan > 0
                            THEN hpt.nilai_penyusutan * dat.kuantitas 
                            ELSE 0
                        END AS debet,
                        0 AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        JSON_OBJECT(
                            'detail', JSON_OBJECT (
                                'satuan_barang_name', sbt.name,
                                'kuantitas', dat.kuantitas,
                                'harga_satuan', dat.harga_satuan,
                                'dpp', dat.dpp,
                                'ppn', dat.ppn,
                                'metode_penyusutan', mpt.name,
                                'kelompok_aset', kat.name,
                                'kategori_aset', kat2.name,
                                'supplier_name', st.name,
                                'supplier_code', st.code,
                                'daftar_aset_name', dat.name,
                                'daftar_aset_invoice', dat.nomor_invoice
                            )
                        ) AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "HITUNGAN PENYUSUTAN ASET" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        NULL AS periode,
                        dat.enabled 
                    FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
                    JOIN ${generateDatabaseName(req_id)}.daftar_aset_tab dat ON dat.uuid = hpt.daftar_aset 
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                    JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                    JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                    JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                    JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kat2.kode_akun_perkiraan_kredit
                    AND hpt.enabled = 1
                    AND dat.enabled = 1
                    UNION ALL
                    SELECT 
                        "NOT_AVAILABLE" AS uuid,
                        CONCAT("HP", dat.nomor_invoice) AS bukti_transaksi,
                        1 AS transaksi,
                        LPAD(hpt.tanggal, 2, '0') AS tanggal,
                        LPAD(hpt.bulan, 2, '0') AS bulan,
                        hpt.tahun AS tahun,
                        TIME(dat.tanggal_beli) AS waktu,
                        0 AS debet,
                        CASE
                            WHEN hpt.nilai_penyusutan > 0
                            THEN hpt.nilai_penyusutan * dat.kuantitas 
                            ELSE 0
                        END AS kredit,
                        kapt.code AS kode_akun,
                        kapt.name AS nama_akun,
                        kapt.type AS type_akun,
                        JSON_OBJECT(
                            'detail', JSON_OBJECT (
                                'satuan_barang_name', sbt.name,
                                'kuantitas', dat.kuantitas,
                                'harga_satuan', dat.harga_satuan,
                                'dpp', dat.dpp,
                                'ppn', dat.ppn,
                                'metode_penyusutan', mpt.name,
                                'kelompok_aset', kat.name,
                                'kategori_aset', kat2.name,
                                'supplier_name', st.name,
                                'supplier_code', st.code,
                                'daftar_aset_name', dat.name,
                                'daftar_aset_invoice', dat.nomor_invoice
                            )
                        ) AS uraian,
                        NULL AS deskripsi_kerja,
                        NULL AS keterangan_kerja,
                        "HITUNGAN PENYUSUTAN ASET" AS sumber,
                        NULL AS waktu_mulai,
                        NULL AS waktu_selesai,
                        NULL AS total_jam,
                        NULL AS total_menit,
                        NULL AS nilai_lembur_per_menit,
                        NULL AS pegawai_name,
                        NULL AS periode,
                        dat.enabled 
                    FROM ${generateDatabaseName(req_id)}.hitungan_penyusutan_tab hpt 
                    JOIN ${generateDatabaseName(req_id)}.daftar_aset_tab dat ON dat.uuid = hpt.daftar_aset 
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = dat.satuan_barang
                    JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = dat.supplier 
                    JOIN ${generateDatabaseName(req_id)}.metode_penyusutan_tab mpt ON mpt.uuid = dat.metode_penyusutan 
                    JOIN ${generateDatabaseName(req_id)}.kelompok_aset_tab kat ON kat.uuid = dat.kelompok_aset
                    JOIN ${generateDatabaseName(req_id)}.kategori_aset_tab kat2 ON kat2.uuid = dat.kategori_aset 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kat2.kode_akun_perkiraan_debet
                    AND hpt.enabled = 1
                    AND dat.enabled = 1
                ) AS res
                WHERE res.bulan = :bulan AND res.tahun = :tahun
                AND (
                    res.uraian LIKE :search 
                    OR res.bukti_transaksi LIKE :search
                    OR res.kode_akun LIKE :search
                    OR res.nama_akun LIKE :search
                    OR res.type_akun LIKE :search
                    OR res.debet LIKE :search
                    OR res.kredit LIKE :search
                )
            ${sorting == "bukti_transaksi" ? 'ORDER BY res.tanggal ASC, res.waktu ASC, res.bukti_transaksi ASC, res.transaksi ASC' : 'ORDER BY res.tanggal ASC'}
        `,
        {
            replacements: {
                bulan,
                tahun,
                search: `%${search}%`
            },
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return jurnalUmums
}

export const createJurnalUmumRepo = async (jurnalUmumData, req_id) => {
    jurnalUmumData = removeDotInRupiahInput(jurnalUmumData, [
        "debet", "kredit"
    ])
    return insertQueryUtil(
        req_id, 
        generateDatabaseName(req_id),
        JurnalUmumModel,
        {
            tanggal: jurnalUmumData.tanggal,
            bulan: jurnalUmumData.bulan,
            tahun: jurnalUmumData.tahun,
            waktu: jurnalUmumData.waktu,
            uraian: jurnalUmumData.uraian,
            debet: jurnalUmumData.debet,
            kredit: jurnalUmumData.kredit,
            kode_akun_uuid: jurnalUmumData.kode_akun_uuid,
            bukti_transaksi: jurnalUmumData.bukti_transaksi,
            transaksi: jurnalUmumData.transaksi,
            enabled: jurnalUmumData.enabled
        }
    )
}

export const deleteJurnalUmumByUuidRepo = async (uuid, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JurnalUmumModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const getJurnalUmumByBuktiTransaksiRepo = async (bukti_transaksi, uuidList, req_id) => {
    const jurnalUmums = await db.query(
        `
            SELECT 
                SUM(res.count) AS count
            FROM (
                SELECT 
                    COUNT(0) AS count
                FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut
                WHERE jut.bukti_transaksi = :bukti_transaksi AND jut.enabled = 1
                ${uuidList != "EMPTY" ? `AND jut.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt  
                WHERE tkt.bukti_transaksi = :bukti_transaksi AND tkt.enabled = 1
                ${uuidList != "EMPTY" ? `AND tkt.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt  
                WHERE tbt.bukti_transaksi = :bukti_transaksi AND tbt.enabled = 1
                ${uuidList != "EMPTY" ? `AND tbt.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.gaji_tab gt  
                WHERE gt.bukti_transaksi = :bukti_transaksi AND gt.enabled = 1
                ${uuidList != "EMPTY" ? `AND gt.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut  
                WHERE tut.bukti_transaksi = :bukti_transaksi AND tut.enabled = 1
                ${uuidList != "EMPTY" ? `AND tut.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.lembur_tab lt  
                WHERE lt.bukti_transaksi = :bukti_transaksi AND lt.enabled = 1
                ${uuidList != "EMPTY" ? `AND lt.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.hadiah_tab ht  
                WHERE ht.bukti_transaksi = :bukti_transaksi AND ht.enabled = 1
                ${uuidList != "EMPTY" ? `AND ht.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.pph2126_tab pt  
                WHERE pt.bukti_transaksi = :bukti_transaksi AND pt.enabled = 1
                ${uuidList != "EMPTY" ? `AND pt.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt  
                WHERE llt.bukti_transaksi = :bukti_transaksi AND llt.enabled = 1
                ${uuidList != "EMPTY" ? `AND llt.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.kerugian_tab kt  
                WHERE kt.bukti_transaksi = :bukti_transaksi AND kt.enabled = 1
                ${uuidList != "EMPTY" ? `AND kt.uuid NOT IN(${uuidList})` : ''}
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt  
                WHERE pkt.bukti_transaksi = :bukti_transaksi AND pkt.enabled = 1
                ${uuidList != "EMPTY" ? `AND pkt.uuid NOT IN(${uuidList})` : ''}
            ) AS res
        `,
        {
            replacements: {
                bukti_transaksi: bukti_transaksi
            },
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return jurnalUmums
}

export const getJurnalUmumByBuktiTransaksiAllDataRepo = async (bukti_transaksi, uuidList, req_id) => {
    const jurnalUmums = await db.query(
        `
            SELECT 
                jut.bulan,
                jut.tahun
            FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut
            WHERE jut.bukti_transaksi = :bukti_transaksi AND jut.enabled = 1
            ${uuidList != "EMPTY" ? `AND jut.uuid NOT IN(:uuid_list)` : ''}
        `,
        {
            replacements: {
                bukti_transaksi,
                uuid_list: uuidList
            },
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return jurnalUmums
}

export const deleteJurnalUmumByBuktiTransaksiRepo = async (bukti_transaksi, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JurnalUmumModel,
        {
            enabled: false
        },
        {
            bukti_transaksi
        }
    )
}

export const updateJurnalUmumByUuidRepo = async (uuid, jurnalUmumData, req_id) => {
    jurnalUmumData = removeDotInRupiahInput(jurnalUmumData, [
        "debet", "kredit"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        JurnalUmumModel,
        {
            tanggal: jurnalUmumData.tanggal,
            bulan: jurnalUmumData.bulan,
            tahun: jurnalUmumData.tahun,
            uraian: jurnalUmumData.uraian,
            debet: jurnalUmumData.debet,
            kredit: jurnalUmumData.kredit,
            kode_akun_uuid: jurnalUmumData.kode_akun_uuid,
            bukti_transaksi: jurnalUmumData.bukti_transaksi,
            transaksi: jurnalUmumData.transaksi,
        },
        {
            uuid
        }
    )
}