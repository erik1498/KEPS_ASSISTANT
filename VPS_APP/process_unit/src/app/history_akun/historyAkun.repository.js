import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import { generateDatabaseName } from "../../utils/databaseUtil.js";
import { payrollPegawaiViewQueryBuilder } from "../../config/viewDatabase/payrollPegawaiViewQueryBuilder.js";

export const getHistoryAkunByUuidAndBulanRepo = async (uuid, bulan, tahun, search, req_id) => {
    const historyAkun = await db.query(
        `
            SELECT 
                res.*
            FROM
            (
                SELECT 
                    jut.uuid,
                    jut.bukti_transaksi,
                    jut.tanggal,
                    jut.bulan,
                    jut.tahun,
                    jut.waktu,
                    jut.transaksi,
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
                    0 AS transaksi,
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
                    0 AS transaksi,
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
                    0 AS transaksi,
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
                    0 AS transaksi,
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
                UNION ALL -- PAYROLL START
                ${payrollPegawaiViewQueryBuilder(req_id)}
                UNION ALL -- PERINTAH STOK OPNAME START
                SELECT 
                    psojt.uuid,
                    psojt.bukti_transaksi,
                    LPAD(DAY(psojt.tanggal), 2, '0') AS tanggal,
                    LPAD(MONTH(psojt.tanggal), 2, '0') AS bulan,
                    YEAR(psojt.tanggal) AS tahun,
                    TIME(psojt.tanggal) AS waktu,
                    psojt.transaksi,
                    psojt.debet,
                    psojt.kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    JSON_OBJECT(
                        'detail', psojt.detail_data
                    ) AS uraian,
                    psojt.sumber,
                    psojt.enabled 
                FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_jurnal_tab psojt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = psojt.kode_akun_perkiraan 
            ) AS res
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.code = res.kode_akun
            WHERE res.bulan = "${bulan}" AND res.tahun = "${tahun}"
            AND kapt.uuid = "${uuid}"
            ORDER BY res.tahun ASC, res.bulan ASC, res.tanggal ASC, res.waktu ASC, res.transaksi ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return historyAkun
}