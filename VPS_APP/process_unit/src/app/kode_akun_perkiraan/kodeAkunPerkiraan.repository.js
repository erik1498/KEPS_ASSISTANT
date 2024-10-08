import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KodeAkunPerkiraanModel from "./kodeAkunPerkiraan.model.js";
import { generateDatabaseName, insertQueryUtil, selectAllQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllKodeAkunPerkiraanRepo = async (pageNumber, size, search, req_id) => {
    const kodeAkunPerkiraansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kodeAkunPerkiraansCount[0].count

    const kodeAkunPerkiraans = await db.query(
        `
            SELECT kapt.* FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt
            WHERE kapt.name LIKE '%${search}%' 
            AND kapt.enabled = 1 
            ORDER BY kapt.code ASC LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kodeAkunPerkiraans,
        count: kodeAkunPerkiraansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKodeAkunPerkiraanByCodeRepo = async (code, uuid, req_id) => {
    const kodeAkunPerkiraan = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab WHERE code = '${code}' AND enabled = 1
            ${uuid != null ? `AND kode_akun_perkiraan_tab.uuid != "${uuid}"` : ''}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KodeAkunPerkiraanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getKodeAkunPerkiraanByUuidSudahDigunakanRepo = async (uuid, req_id) => {
    const jurnalUmumWithKodeAkunByUuid = await db.query(
        `
            SELECT 
                jut.tanggal,
                jut.bulan,
                jut.tahun,
                jut.bukti_transaksi 
            FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut
            WHERE jut.enabled = 1
            AND jut.kode_akun_uuid = "${uuid}"
            UNION ALL
            SELECT
                DAY(tkt.tanggal) AS tanggal,
                MONTH(tkt.tanggal) AS bulan,
                YEAR(tkt.tanggal) AS tahun,
                tkt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt 
            WHERE tkt.enabled = 1
            AND tkt.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(tbt.tanggal) AS tanggal,
                MONTH(tbt.tanggal) AS bulan,
                YEAR(tbt.tanggal) AS tahun,
                tbt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt 
            WHERE tbt.enabled = 1
            AND tbt.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(gt.tanggal) AS tanggal,
                MONTH(gt.tanggal) AS bulan,
                YEAR(gt.tanggal) AS tahun,
                gt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            WHERE gt.enabled = 1
            AND gt.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(gt.tanggal) AS tanggal,
                MONTH(gt.tanggal) AS bulan,
                YEAR(gt.tanggal) AS tahun,
                gt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            WHERE gt.enabled = 1
            AND gt.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(tut.tanggal) AS tanggal,
                MONTH(tut.tanggal) AS bulan,
                YEAR(tut.tanggal) AS tahun,
                tut.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.enabled = 1
            AND tut.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(lt.tanggal) AS tanggal,
                MONTH(lt.tanggal) AS bulan,
                YEAR(lt.tanggal) AS tahun,
                lt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.lembur_tab lt
            WHERE lt.enabled = 1
            AND lt.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(ht.tanggal) AS tanggal,
                MONTH(ht.tanggal) AS bulan,
                YEAR(ht.tanggal) AS tahun,
                ht.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.hadiah_tab ht
            WHERE ht.enabled = 1
            AND ht.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(pt.tanggal) AS tanggal,
                MONTH(pt.tanggal) AS bulan,
                YEAR(pt.tanggal) AS tahun,
                pt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.pph2126_tab pt
            WHERE pt.enabled = 1
            AND pt.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(ltt.tanggal) AS tanggal,
                MONTH(ltt.tanggal) AS bulan,
                YEAR(ltt.tanggal) AS tahun,
                ltt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.lain_lain_tab ltt
            WHERE ltt.enabled = 1
            AND ltt.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(kt.tanggal) AS tanggal,
                MONTH(kt.tanggal) AS bulan,
                YEAR(kt.tanggal) AS tahun,
                kt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.kerugian_tab kt
            WHERE kt.enabled = 1
            AND kt.kode_akun_perkiraan = "${uuid}"
            UNION ALL
            SELECT
                DAY(pkt.tanggal) AS tanggal,
                MONTH(pkt.tanggal) AS bulan,
                YEAR(pkt.tanggal) AS tahun,
                pkt.bukti_transaksi
            FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt
            WHERE pkt.enabled = 1
            AND pkt.kode_akun_perkiraan = "${uuid}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return jurnalUmumWithKodeAkunByUuid
}

export const createKodeAkunPerkiraanRepo = async (kodeAkunPerkiraanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KodeAkunPerkiraanModel,
        {
            type: kodeAkunPerkiraanData.type,
            name: kodeAkunPerkiraanData.name,
            code: kodeAkunPerkiraanData.code,
            update_permission: kodeAkunPerkiraanData.update_permission,
            type_transaksi_kas_bank: kodeAkunPerkiraanData.type_transaksi_kas_bank,
            enabled: kodeAkunPerkiraanData.enabled
        }
    )
}

export const deleteKodeAkunPerkiraanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KodeAkunPerkiraanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKodeAkunPerkiraanByUuidRepo = async (uuid, kodeAkunPerkiraanData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KodeAkunPerkiraanModel,
        {
            type: kodeAkunPerkiraanData.type,
            name: kodeAkunPerkiraanData.name,
            code: kodeAkunPerkiraanData.code,
            type_transaksi_kas_bank: kodeAkunPerkiraanData.type_transaksi_kas_bank,
        },
        {
            uuid
        }
    )
}

export const getAllKodeAkunPerkiraanWhereInRepo = async (whereIN, req_id) => {
    const kodeAkunPerkiraans = await db.query(
        `
            SELECT 
                kapt.* 
            FROM ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt
            WHERE kapt.enabled = 1 
            AND kapt.type_transaksi_kas_bank IN ("` + whereIN.join(`","`) + `" )
            ORDER BY kapt.code ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return kodeAkunPerkiraans
}