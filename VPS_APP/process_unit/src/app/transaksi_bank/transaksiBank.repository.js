import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import TransaksiBankModel from "./transaksiBank.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllTransaksiBankRepo = async (bulan, tahun, search, req_id) => {
    return await db.query(
        `
            SELECT 
                res.* 
            FROM (
                SELECT 
                    tbt.uuid,
                    tbt.bukti_transaksi,
                    0 AS transaksi,
                    tbt.tanggal,
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
                    tbt.type,
                    "TRANSAKSI BANK" AS sumber,
                    tbt.enabled 
                FROM ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tbt.kode_akun_perkiraan 
                WHERE tbt.enabled = 1
                UNION ALL
                SELECT 
                    rtbt.uuid,
                    tbt.bukti_transaksi,
                    1 AS transaksi,
                    CONCAT(DATE(tbt.tanggal), "T", rtbt.waktu, ".000") AS tanggal,
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
                    tbt.type,
                    "RINCIAN TRANSAKSI BANK" AS sumber,
                    rtbt.enabled 
                FROM ${generateDatabaseName(req_id)}.rincian_transaksi_bank_tab rtbt 
                JOIN ${generateDatabaseName(req_id)}.transaksi_bank_tab tbt ON tbt.uuid = rtbt.transaksi_bank 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rtbt.kode_akun_perkiraan 
                WHERE rtbt.enabled = 1 AND tbt.enabled = 1
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

export const getTransaksiBankByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        TransaksiBankModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createTransaksiBankRepo = async (transaksiBankData, req_id) => {
    transaksiBankData = removeDotInRupiahInput(transaksiBankData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiBankModel,
        {
            kode_akun_perkiraan: transaksiBankData.kode_akun_perkiraan,
            bukti_transaksi: transaksiBankData.bukti_transaksi,
            tanggal: transaksiBankData.tanggal,
            nilai: transaksiBankData.nilai,
            uraian: transaksiBankData.uraian,
            type: transaksiBankData.type,
            enabled: transaksiBankData.enabled
        }
    )
}

export const deleteTransaksiBankByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiBankModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateTransaksiBankByUuidRepo = async (uuid, transaksiBankData, req_id) => {
    transaksiBankData = removeDotInRupiahInput(transaksiBankData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        TransaksiBankModel,
        {
            kode_akun_perkiraan: transaksiBankData.kode_akun_perkiraan,
            bukti_transaksi: transaksiBankData.bukti_transaksi,
            tanggal: transaksiBankData.tanggal,
            nilai: transaksiBankData.nilai,
            uraian: transaksiBankData.uraian,
            type: transaksiBankData.type,
        },
        {
            uuid
        }
    )
}