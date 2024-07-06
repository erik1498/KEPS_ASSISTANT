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
            WHERE jut.bulan = ${bulan} AND jut.tahun = ${new Date().getFullYear()}
            AND kapt.type IN ("Harta", "Utang", "Modal")
        `,
        { type: Sequelize.QueryTypes.SELECT }
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
            WHERE jut.bulan = ${bulan} AND jut.tahun = ${new Date().getFullYear()}
            AND kapt.type IN ("Pendapatan", "Beban")
        `,
        { type: Sequelize.QueryTypes.SELECT }
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
                    AND (
                        jut.uraian LIKE '%${search}%' 
                        OR jut.bukti_transaksi LIKE '%${search}%'
                        OR kapt.code LIKE '%${search}%'
                        OR kapt.type LIKE '%${search}%'
                        OR kapt.name LIKE '%${search}%'
                        OR jut.debet LIKE '%${search}%'
                        OR jut.kredit LIKE '%${search}%'
                    )
                ) AS res
                WHERE res.bulan = "${bulan}" AND res.tahun = "${tahun}"
            ${sorting == "bukti_transaksi" ? 'ORDER BY res.tanggal ASC, res.waktu ASC, res.bukti_transaksi ASC' : 'ORDER BY res.tanggal ASC'}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return jurnalUmums
}

export const createJurnalUmumRepo = async (jurnalUmumData, req_id) => {
    jurnalUmumData = removeDotInRupiahInput(jurnalUmumData, [
        "debet", "kredit"
    ])
    return insertQueryUtil(
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
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut
            WHERE jut.bukti_transaksi = "${bukti_transaksi}" AND jut.enabled = 1
            ${uuidList != "EMPTY" ? `AND jut.uuid NOT IN(${uuidList})` : ''}
        `,
        { type: Sequelize.QueryTypes.SELECT }
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
            WHERE jut.bukti_transaksi = "${bukti_transaksi}" AND jut.enabled = 1
            ${uuidList != "EMPTY" ? `AND jut.uuid NOT IN(${uuidList})` : ''}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return jurnalUmums
}

export const deleteJurnalUmumByBuktiTransaksiRepo = async (bukti_transaksi, req_id) => {
    updateQueryUtil(
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