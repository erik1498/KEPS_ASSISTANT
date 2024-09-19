import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import LainLainModel from "./lainLain.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllLainLainRepo = async (pageNumber, size, search, req_id) => {
    const lainLainsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.lain_lain_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : lainLainsCount[0].count

    const lainLains = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.lain_lain_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: lainLains,
        count: lainLainsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getLainLainByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        LainLainModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getLainLainByPegawaiUUIDRepo = async (uuid, periode, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                llt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = llt.kode_akun_perkiraan 
            WHERE llt.pegawai = "${uuid}"
            AND llt.enabled = 1
            AND YEAR(llt.tanggal) = "${tahun}"
            AND llt.periode = "${periode}"
            ORDER BY llt.periode ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const createLainLainRepo = async (lainLainData, req_id) => {
    lainLainData = removeDotInRupiahInput(lainLainData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LainLainModel,
        {
            pegawai: lainLainData.pegawai,
            periode: lainLainData.periode,
            nilai: lainLainData.nilai,
            tanggal: lainLainData.tanggal,
            bukti_transaksi: lainLainData.bukti_transaksi,
            keterangan: lainLainData.keterangan,
            kode_akun_perkiraan: lainLainData.kode_akun_perkiraan,
            enabled: lainLainData.enabled
        }
    )
}

export const deleteLainLainByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LainLainModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateLainLainByUuidRepo = async (uuid, lainLainData, req_id) => {
    lainLainData = removeDotInRupiahInput(lainLainData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        LainLainModel,
        {
            pegawai: lainLainData.pegawai,
            periode: lainLainData.periode,
            nilai: lainLainData.nilai,
            tanggal: lainLainData.tanggal,
            bukti_transaksi: lainLainData.bukti_transaksi,
            keterangan: lainLainData.keterangan,
            kode_akun_perkiraan: lainLainData.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}