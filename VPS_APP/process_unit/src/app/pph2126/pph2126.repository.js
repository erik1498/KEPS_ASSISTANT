import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Pph2126Model from "./pph2126.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllPph2126Repo = async (pageNumber, size, search, req_id) => {
    const pph2126sCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pph2126_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pph2126sCount[0].count

    const pph2126s = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pph2126_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pph2126s,
        count: pph2126sCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPph2126ByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        Pph2126Model,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getPph2126ByPegawaiUuidRepo = async (uuid, periode, tahun, req_id) => {
    return db.query(
        `
            SELECT 
                pt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.pph2126_tab pt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pt.kode_akun_perkiraan 
            WHERE pt.pegawai = "${uuid}"
            AND pt.enabled = 1
            AND YEAR(pt.tanggal) = "${tahun}"
            AND pt.periode = "${periode}"
            ORDER BY pt.periode ASC
            LIMIT 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createPph2126Repo = async (pph2126Data, req_id) => {
    pph2126Data = removeDotInRupiahInput(pph2126Data, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        Pph2126Model,
        {
            pegawai: pph2126Data.pegawai,
            periode: pph2126Data.periode,
            nilai: pph2126Data.nilai,
            tanggal: pph2126Data.tanggal,
            bukti_transaksi: pph2126Data.bukti_transaksi,
            kode_akun_perkiraan: pph2126Data.kode_akun_perkiraan,
            enabled: pph2126Data.enabled
        }
    )
}

export const deletePph2126ByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        Pph2126Model,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePph2126ByUuidRepo = async (uuid, pph2126Data, req_id) => {
    pph2126Data = removeDotInRupiahInput(pph2126Data, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        Pph2126Model,
        {
            pegawai: pph2126Data.pegawai,
            periode: pph2126Data.periode,
            nilai: pph2126Data.nilai,
            tanggal: pph2126Data.tanggal,
            bukti_transaksi: pph2126Data.bukti_transaksi,
            kode_akun_perkiraan: pph2126Data.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}