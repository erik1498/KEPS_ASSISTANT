import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import HadiahModel from "./hadiah.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllHadiahRepo = async (pageNumber, size, search, req_id) => {
    const hadiahsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.hadiah_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : hadiahsCount[0].count

    const hadiahs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.hadiah_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: hadiahs,
        count: hadiahsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getHadiahByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        HadiahModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getHadiahByPegawaiUuidRepo = async (uuid, req_id) => {
    const gajis = await db.query(
        `
            SELECT 
                ht.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ht.kode_akun_perkiraan 
            WHERE ht.pegawai = "${uuid}"
            AND ht.enabled = 1
            ORDER BY ht.periode ASC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return gajis
}

export const createHadiahRepo = async (hadiahData, req_id) => {
    hadiahData = removeDotInRupiahInput(hadiahData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HadiahModel,
        {
            pegawai: hadiahData.pegawai,
            periode: hadiahData.periode,
            kode_akun_perkiraan: hadiahData.kode_akun_perkiraan,
            tanggal: hadiahData.tanggal,
            bukti_transaksi: hadiahData.bukti_transaksi,
            hadiah: hadiahData.hadiah,
            nilai: hadiahData.nilai,
            enabled: hadiahData.enabled
        }
    )
}

export const deleteHadiahByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HadiahModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateHadiahByUuidRepo = async (uuid, hadiahData, req_id) => {
    hadiahData = removeDotInRupiahInput(hadiahData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HadiahModel,
        {
            pegawai: hadiahData.pegawai,
            periode: hadiahData.periode,
            kode_akun_perkiraan: hadiahData.kode_akun_perkiraan,
            tanggal: hadiahData.tanggal,
            bukti_transaksi: hadiahData.bukti_transaksi,
            hadiah: hadiahData.hadiah,
            nilai: hadiahData.nilai,
        },
        {
            uuid
        }
    )
}