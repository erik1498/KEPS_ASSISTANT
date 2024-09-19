import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KerugianModel from "./kerugian.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllKerugianRepo = async (pageNumber, size, search, req_id) => {
    const kerugiansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.kerugian_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kerugiansCount[0].count

    const kerugians = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.kerugian_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kerugians,
        count: kerugiansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKerugianByPegawaiUUIDRepo = async (uuid, periode, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                kt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kt.kode_akun_perkiraan 
            WHERE kt.pegawai = "${uuid}"
            AND kt.enabled = 1
            AND YEAR(kt.tanggal) = "${tahun}"
            AND kt.periode = "${periode}"
            ORDER BY kt.periode ASC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getKerugianByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KerugianModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKerugianRepo = async (kerugianData, req_id) => {
    kerugianData = removeDotInRupiahInput(kerugianData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KerugianModel,
        {
            pegawai: kerugianData.pegawai,
            periode: kerugianData.periode,
            nilai: kerugianData.nilai,
            tanggal: kerugianData.tanggal,
            bukti_transaksi: kerugianData.bukti_transaksi,
            keterangan: kerugianData.keterangan,
            kode_akun_perkiraan: kerugianData.kode_akun_perkiraan,
            enabled: kerugianData.enabled
        }
    )
}

export const deleteKerugianByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KerugianModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKerugianByUuidRepo = async (uuid, kerugianData, req_id) => {
    kerugianData = removeDotInRupiahInput(kerugianData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KerugianModel,
        {
            pegawai: kerugianData.pegawai,
            periode: kerugianData.periode,
            nilai: kerugianData.nilai,
            tanggal: kerugianData.tanggal,
            bukti_transaksi: kerugianData.bukti_transaksi,
            keterangan: kerugianData.keterangan,
            kode_akun_perkiraan: kerugianData.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}