import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import JurnalUmumModel from "./jurnalUmum.model.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getJurnalUmumByUuidRepo = async (uuid, req_id) => {
    const jurnalUmum = await JurnalUmumModel.findOne({
        where: {
            uuid,
        }
    })
    return jurnalUmum
}

export const getJurnalUmumNeracaByBulanRepo = async (bulan, req_id) => {
    bulan = bulan < 10 ? "0" + bulan : bulan
    const jurnalUmums = await db.query(
        `
            SELECT 
                jurnal_umum_tab.*,
                kode_akun_perkiraan_tab.code AS kode_akun,
                kode_akun_perkiraan_tab.name AS nama_akun,
                kode_akun_perkiraan_tab.type AS type_akun 
            FROM jurnal_umum_tab JOIN kode_akun_perkiraan_tab ON jurnal_umum_tab.kode_akun_uuid = kode_akun_perkiraan_tab.uuid
            WHERE jurnal_umum_tab.bulan = ${bulan} AND jurnal_umum_tab.tahun = ${new Date().getFullYear()}
            AND kode_akun_perkiraan_tab.type IN ("Harta", "Utang", "Modal")
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
                    jurnal_umum_tab.*,
                    kode_akun_perkiraan_tab.code AS kode_akun,
                    kode_akun_perkiraan_tab.name AS nama_akun,
                    kode_akun_perkiraan_tab.type AS type_akun 
                FROM jurnal_umum_tab JOIN kode_akun_perkiraan_tab ON jurnal_umum_tab.kode_akun_uuid = kode_akun_perkiraan_tab.uuid
                WHERE jurnal_umum_tab.bulan = ${bulan} AND jurnal_umum_tab.tahun = ${new Date().getFullYear()}
                AND kode_akun_perkiraan_tab.type IN ("Pendapatan", "Beban")
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
                    FROM jurnal_umum_tab jut
                    JOIN kode_akun_perkiraan_tab kapt ON kapt.uuid = jut.kode_akun_uuid
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
    const jurnalUmum = await JurnalUmumModel.create({
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
    })
    return jurnalUmum
}

export const deleteJurnalUmumByUuidRepo = async (uuid, req_id) => {
    await getJurnalUmumByUuidRepo(uuid);
    await JurnalUmumModel.update({
        enabled: false
    }, {
        where: {
            uuid,
        }
    })
}

export const getJurnalUmumByBuktiTransaksiRepo = async (bukti_transaksi, uuidList, req_id) => {
    const jurnalUmums = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM jurnal_umum_tab jut
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
            FROM jurnal_umum_tab jut
            WHERE jut.bukti_transaksi = "${bukti_transaksi}" AND jut.enabled = 1
            ${uuidList != "EMPTY" ? `AND jut.uuid NOT IN(${uuidList})` : ''}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return jurnalUmums
}

export const deleteJurnalUmumByBuktiTransaksiRepo = async (bukti_transaksi, req_id) => {
    await JurnalUmumModel.update({
        enabled: false
    }, {
        where: {
            bukti_transaksi,
        }
    })
}

export const updateJurnalUmumByUuidRepo = async (uuid, jurnalUmumData, req_id) => {
    jurnalUmumData = removeDotInRupiahInput(jurnalUmumData, [
        "debet", "kredit"
    ])
    const jurnalUmum = await JurnalUmumModel.update({
        tanggal: jurnalUmumData.tanggal,
        bulan: jurnalUmumData.bulan,
        tahun: jurnalUmumData.tahun,
        uraian: jurnalUmumData.uraian,
        debet: jurnalUmumData.debet,
        kredit: jurnalUmumData.kredit,
        kode_akun_uuid: jurnalUmumData.kode_akun_uuid,
        bukti_transaksi: jurnalUmumData.bukti_transaksi,
        transaksi: jurnalUmumData.transaksi,
    }, {
        where: {
            uuid,
        }
    })
    return jurnalUmum
}