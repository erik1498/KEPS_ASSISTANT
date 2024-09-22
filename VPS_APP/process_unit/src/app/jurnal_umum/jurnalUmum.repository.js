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
                        "JURNAL UMUM" AS sumber,
                        jut.enabled
                    FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = jut.kode_akun_uuid
                    WHERE kapt.enabled = 1 AND jut.enabled = 1
                    UNION ALL
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
                        "TRANSAKSI KAS" AS sumber,
                        tkt.enabled 
                    FROM ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tkt.kode_akun_perkiraan 
                    WHERE tkt.enabled = 1
                    UNION ALL
                    SELECT 
                        rtkt.uuid,
                        tkt.bukti_transaksi,
                        0 AS transaksi,
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
                        "TRANSAKSI BANK" AS sumber,
                        tbt.enabled 
                    FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tbt.kode_akun_perkiraan 
                    WHERE tbt.enabled = 1
                    UNION ALL
                    SELECT 
                        rtbt.uuid,
                        tbt.bukti_transaksi,
                        0 AS transaksi,
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
                        "TRANSAKSI BANK" AS sumber,
                        rtbt.enabled 
                    FROM ${generateDatabaseName(req_id)}.rincian_transaksi_bank_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt ON tbt.uuid = rtbt.transaksi_bank 
                    JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtbt.kode_akun_perkiraan 
                    WHERE rtbt.enabled = 1 AND tbt.enabled = 1
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
            ${sorting == "bukti_transaksi" ? 'ORDER BY res.tanggal ASC, res.waktu ASC, res.bukti_transaksi ASC' : 'ORDER BY res.tanggal ASC'}
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
            enabled: jurnalUmumData.enabled,
            client_id: JSON.parse(req_id).client_id
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
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt  
                WHERE tbt.bukti_transaksi = :bukti_transaksi AND tbt.enabled = 1
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.gaji_tab gt  
                WHERE gt.bukti_transaksi = :bukti_transaksi AND gt.enabled = 1
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut  
                WHERE tut.bukti_transaksi = :bukti_transaksi AND tut.enabled = 1
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.lembur_tab lt  
                WHERE lt.bukti_transaksi = :bukti_transaksi AND lt.enabled = 1
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.hadiah_tab ht  
                WHERE ht.bukti_transaksi = :bukti_transaksi AND ht.enabled = 1
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.pph2126_tab pt  
                WHERE pt.bukti_transaksi = :bukti_transaksi AND pt.enabled = 1
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt  
                WHERE llt.bukti_transaksi = :bukti_transaksi AND llt.enabled = 1
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.kerugian_tab kt  
                WHERE kt.bukti_transaksi = :bukti_transaksi AND kt.enabled = 1
                UNION ALL
                SELECT 
                    COUNT(0) AS count 
                FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt  
                WHERE pkt.bukti_transaksi = :bukti_transaksi AND pkt.enabled = 1
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