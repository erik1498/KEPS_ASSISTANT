import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KodeAkunPerkiraanModel from "./kodeAkunPerkiraan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

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
                jut.*
            FROM ${generateDatabaseName(req_id)}.jurnal_umum_tab jut 
            WHERE jut.kode_akun_uuid = "${uuid}" 
            AND jut.enabled = 1 
            AND jut.bulan < "${new Date().getMonth()}"
            AND jut.tahun <= "${new Date().getFullYear()}"
            ORDER BY jut.tanggal ASC, jut.bulan ASC, jut.tahun 
            ASC LIMIT 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return jurnalUmumWithKodeAkunByUuid
}

export const createKodeAkunPerkiraanRepo = async (kodeAkunPerkiraanData, req_id) => {
    return insertQueryUtil(
        generateDatabaseName(req_id),
        KodeAkunPerkiraanModel,
        {
            type: kodeAkunPerkiraanData.type,
            name: kodeAkunPerkiraanData.name,
            code: kodeAkunPerkiraanData.code,
            enabled: kodeAkunPerkiraanData.enabled,
            client_id: req_id
        }
    )
}

export const deleteKodeAkunPerkiraanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
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
        generateDatabaseName(req_id),
        KodeAkunPerkiraanModel,
        {
            type: kodeAkunPerkiraanData.type,
            name: kodeAkunPerkiraanData.name,
            code: kodeAkunPerkiraanData.code,
        },
        {
            uuid
        }
    )
}