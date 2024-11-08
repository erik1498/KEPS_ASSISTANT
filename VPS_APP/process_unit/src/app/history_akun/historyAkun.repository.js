import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { generateDatabaseName } from "../../utils/databaseUtil.js";

export const getHistoryAkunByUuidAndBulanRepo = async (uuid, bulan, tahun, search, addQuery, req_id) => {
    const historyAkun = await db.query(
        `
            SELECT 
                res.*
            FROM
            (
                ${addQuery}
                SELECT 
                    jut.uuid,
                    jut.bukti_transaksi,
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
                    "JURNAL UMUM" AS sumber,
                    jut.enabled
                FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = jut.kode_akun_uuid
                WHERE kapt.enabled = 1 AND jut.enabled = 1
                UNION ALL
                SELECT 
                    tkt.uuid,
                    tkt.bukti_transaksi,
                    LPAD(DATE(tkt.tanggal), 2, '0') AS tanggal,
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
                    "TRANSAKSI KAS" AS sumber,
                    tkt.enabled 
                FROM ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tkt.kode_akun_perkiraan 
                WHERE tkt.enabled = 1
                UNION ALL
                SELECT 
                    rtkt.uuid,
                    tkt.bukti_transaksi,
                    LPAD(DATE(tkt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(tkt.tanggal), 2, '0') AS bulan,
                    YEAR(tkt.tanggal) AS tahun,
                    rtkt.waktu,
                    CASE 
                        WHEN tkt.type = 2
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
                    "TRANSAKSI KAS" AS sumber,
                    rtkt.enabled 
                FROM ${generateDatabaseName(req_id)}.rincian_transaksi_kas_tab rtkt 
                JOIN ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt ON tkt.uuid = rtkt.transaksi_kas 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtkt.kode_akun_perkiraan 
                WHERE rtkt.enabled = 1 AND tkt.enabled = 1
                UNION ALL
                SELECT 
                    tbt.uuid,
                    tbt.bukti_transaksi,
                    LPAD(DATE(tbt.tanggal), 2, '0') AS tanggal,
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
                    "TRANSAKSI KAS" AS sumber,
                    tbt.enabled 
                FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tbt.kode_akun_perkiraan 
                WHERE tbt.enabled = 1
                UNION ALL
                SELECT 
                    rtbt.uuid,
                    tbt.bukti_transaksi,
                    LPAD(DATE(tbt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(tbt.tanggal), 2, '0') AS bulan,
                    YEAR(tbt.tanggal) AS tahun,
                    rtbt.waktu,
                    CASE 
                        WHEN tbt.type = 2
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
                    "TRANSAKSI KAS" AS sumber,
                    rtbt.enabled 
                FROM ${generateDatabaseName(req_id)}.rincian_transaksi_bank_tab rtbt 
                JOIN ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt ON tbt.uuid = rtbt.transaksi_bank 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtbt.kode_akun_perkiraan 
                WHERE rtbt.enabled = 1 AND tbt.enabled = 1
                UNION ALL -- GAJI START
                SELECT 
                    gt.uuid,
                    gt.bukti_transaksi,
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
                    "GAJI PEGAWAI" AS sumber,
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
                    "GAJI PEGAWAI" AS sumber,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "dc632a24-dba2-4c65-9b42-968de322fe1c"
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "5555ff3a-9de0-42b5-bdc8-f39c43947496" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262"
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    tut.uuid,
                    tut.bukti_transaksi,
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
                    "TUNJANGAN UANG PEGAWAI" AS sumber,
                    tut.enabled 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
                WHERE tut.enabled = 1
                AND kapt.enabled = 1
                UNION ALL -- LEMBUR START
                SELECT 
                    lt.uuid,
                    lt.bukti_transaksi,
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
                    "LEMBUR PEGAWAI" AS sumber,
                    lt.enabled 
                FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = lt.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = lt.pegawai 
                WHERE lt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    lt.uuid,
                    lt.bukti_transaksi,
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
                    "LEMBUR PEGAWAI" AS sumber,
                    lt.enabled 
                FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "96dc1c2e-1cd3-42b8-b580-3932ebe1e82d" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = lt.pegawai 
                WHERE lt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL -- HADIAH START
                SELECT 
                    ht.uuid,
                    ht.bukti_transaksi,
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
                    "HADIAH PEGAWAI" AS sumber,
                    ht.enabled 
                FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ht.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
                WHERE ht.enabled = 1
                AND kapt.enabled = 1
                UNION ALL 
                SELECT 
                    ht.uuid,
                    ht.bukti_transaksi,
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
                    "HADIAH PEGAWAI" AS sumber,
                    ht.enabled 
                FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "a09a5e0c-9544-4a83-b214-c47cf5c07bdd"
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
                WHERE ht.enabled = 1
                AND kapt.enabled = 1
                UNION ALL -- PPH2126 START
                SELECT 
                    ppt.uuid,
                    ppt.bukti_transaksi,
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
                    "PPH 21/26" AS sumber,
                    ppt.enabled 
                FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppt.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
                WHERE pt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    ppt.uuid,
                    ppt.bukti_transaksi,
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
                    "PPH 21/26" AS sumber,
                    ppt.enabled 
                FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "eadfec72-7d66-4597-998d-8acf959d34b7" 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
                WHERE pt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL -- LAIN LAIN START
                SELECT 
                    llt.uuid,
                    llt.bukti_transaksi,
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
                    "LAIN - LAIN" AS sumber,
                    llt.enabled 
                FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = llt.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
                WHERE llt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    llt.uuid,
                    llt.bukti_transaksi,
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
                    "LAIN - LAIN" AS sumber,
                    llt.enabled 
                FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "b7687ceb-6046-4062-979d-bfed5550bd87"
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
                WHERE llt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL -- KERUGIAN START
                SELECT 
                    kt.uuid,
                    kt.bukti_transaksi,
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
                    "KERUGIAN" AS sumber,
                    kt.enabled 
                FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kt.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
                WHERE kt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    kt.uuid,
                    kt.bukti_transaksi,
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
                    "KERUGIAN" AS sumber,
                    kt.enabled 
                FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "f3eafc29-6a1c-4e57-b789-532b490dac33"
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
                WHERE kt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL -- PIUTANG PEGAWAI START
                SELECT 
                    pkt.uuid,
                    pkt.bukti_transaksi,
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
                    "PIUTANG KARYAWAN" AS sumber,
                    pkt.enabled 
                FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pkt.kode_akun_perkiraan 
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
                WHERE pkt.enabled = 1
                AND kapt.enabled = 1
                UNION ALL
                SELECT 
                    pkt.uuid,
                    pkt.bukti_transaksi,
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
                    "PIUTANG KARYAWAN" AS sumber,
                    pkt.enabled 
                FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "f15e2810-c736-42f6-9a80-6d70e03315de"
                JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
                WHERE pkt.enabled = 1
                AND kapt.enabled = 1
            ) AS res
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.code = res.kode_akun
            WHERE res.bulan = "${bulan}" AND res.tahun = "${tahun}"
            AND res.uraian LIKE '%${search}%'
            AND kapt.uuid = "${uuid}"
            ORDER BY res.tahun ASC, res.bulan ASC, res.tanggal ASC, res.waktu ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return historyAkun
}