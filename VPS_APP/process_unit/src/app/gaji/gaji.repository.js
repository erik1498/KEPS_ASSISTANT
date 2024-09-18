import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import GajiModel from "./gaji.model.js";
import { generateDatabaseName, insertQueryUtil, selectAllQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllGajiRepo = async (pageNumber, size, search, req_id) => {
    const gajisCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.gaji_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : gajisCount[0].count

    const gajis = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.gaji_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: gajis,
        count: gajisCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}


export const getGajiByPegawaiUuidRepo = async (uuid, tahun, req_id) => {
    const gajis = await db.query(
        `
            SELECT 
                gt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = gt.kode_akun_perkiraan 
            WHERE gt.pegawai = "${uuid}"
            AND gt.enabled = 1
            AND YEAR(gt.tanggal) = "${tahun}"
            ORDER BY gt.periode ASC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return gajis
}

export const getGajiByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        GajiModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createGajiRepo = async (gajiData, req_id) => {
    gajiData = removeDotInRupiahInput(gajiData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        GajiModel,
        {
            pegawai: gajiData.pegawai,
            periode: gajiData.periode,
            kode_akun_perkiraan: gajiData.kode_akun_perkiraan,
            bukti_transaksi: gajiData.bukti_transaksi,
            tanggal: gajiData.tanggal,
            nilai: gajiData.nilai,
            enabled: gajiData.enabled
        }
    )
}

export const deleteGajiByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        GajiModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateGajiByUuidRepo = async (uuid, gajiData, req_id) => {
    gajiData = removeDotInRupiahInput(gajiData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        GajiModel,
        {
            pegawai: gajiData.pegawai,
            periode: gajiData.periode,
            kode_akun_perkiraan: gajiData.kode_akun_perkiraan,
            bukti_transaksi: gajiData.bukti_transaksi,
            tanggal: gajiData.tanggal,
            nilai: gajiData.nilai,
        },
        {
            uuid
        }
    )
}