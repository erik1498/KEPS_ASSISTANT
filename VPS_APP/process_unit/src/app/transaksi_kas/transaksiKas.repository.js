import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import TransaksiKasModel from "./transaksiKas.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllTransaksiKasRepo = async (bulan, tahun, search, req_id) => {
    return await db.query(
        `
            SELECT 
                res.* 
            FROM (
                SELECT 
                    tkt.uuid,
                    tkt.bukti_transaksi,
                    0 AS transaksi,
                    tkt.tanggal,
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
                    tkt.type,
                    "TRANSAKSI KAS" AS sumber,
                    tkt.enabled 
                FROM ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tkt.kode_akun_perkiraan 
                WHERE tkt.enabled = 1
                UNION ALL
                SELECT 
                    rtkt.uuid,
                    tkt.bukti_transaksi,
                    1 AS transaksi,
                    CONCAT(DATE(tkt.tanggal), "T", rtkt.waktu, ".000") AS tanggal,
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
                    tkt.type,
                    "TRANSAKSI KAS" AS sumber,
                    rtkt.enabled 
                FROM ${generateDatabaseName(req_id)}.rincian_transaksi_kas_tab rtkt 
                JOIN ${generateDatabaseName(req_id)}.transaksi_kas_tab tkt ON tkt.uuid = rtkt.transaksi_kas 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtkt.kode_akun_perkiraan 
                WHERE rtkt.enabled = 1 AND tkt.enabled = 1
            ) AS res
            WHERE (
                res.uraian LIKE :search 
                OR res.bukti_transaksi LIKE :search
                OR res.kode_akun LIKE :search
                OR res.nama_akun LIKE :search
                OR res.type_akun LIKE :search
                OR res.debet LIKE :search
                OR res.kredit LIKE :search
            )
            AND res.tanggal >= :tanggal_mulai AND res.tanggal <= :tanggal_selesai
            ORDER BY res.transaksi ASC, res.tanggal ASC, res.bukti_transaksi ASC
        `,
        {
            replacements: {
                tanggal_mulai: `${tahun}-${bulan}-01`,
                tanggal_selesai: `${tahun}-${bulan}-31`,
                search: `%${search}%`
            },
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getTransaksiKasByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        TransaksiKasModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createTransaksiKasRepo = async (transaksiKasData, req_id) => {
    transaksiKasData = removeDotInRupiahInput(transaksiKasData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiKasModel,
        {
            kode_akun_perkiraan: transaksiKasData.kode_akun_perkiraan,
            bukti_transaksi: transaksiKasData.bukti_transaksi,
            tanggal: transaksiKasData.tanggal,
            nilai: transaksiKasData.nilai,
            uraian: transaksiKasData.uraian,
            type: transaksiKasData.type,
            enabled: transaksiKasData.enabled
        }
    )
}

export const deleteTransaksiKasByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiKasModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateTransaksiKasByUuidRepo = async (uuid, transaksiKasData, req_id) => {
    transaksiKasData = removeDotInRupiahInput(transaksiKasData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiKasModel,
        {
            kode_akun_perkiraan: transaksiKasData.kode_akun_perkiraan,
            bukti_transaksi: transaksiKasData.bukti_transaksi,
            tanggal: transaksiKasData.tanggal,
            nilai: transaksiKasData.nilai,
            uraian: transaksiKasData.uraian,
            type: transaksiKasData.type,
        },
        {
            uuid
        }
    )
}