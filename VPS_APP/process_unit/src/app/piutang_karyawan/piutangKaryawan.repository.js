import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PiutangKaryawanModel from "./piutangKaryawan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllPiutangKaryawanRepo = async (pageNumber, size, search, req_id) => {
    const piutangKaryawansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : piutangKaryawansCount[0].count

    const piutangKaryawans = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab WHERE pegawai LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: piutangKaryawans,
        count: piutangKaryawansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPiutangKaryawanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PiutangKaryawanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getPiutangKaryawanByPegawaiUUIDRepo = async (uuid, periode, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                pt.*,
                kapt.name AS kode_akun_perkiraan_name,
                kapt.code AS kode_akun_perkiraan_code
            FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pt.kode_akun_perkiraan 
            WHERE pt.pegawai = "${uuid}"
            AND pt.enabled = 1
            AND YEAR(pt.tanggal) = "${tahun}"
            AND pt.periode = "${periode}"
            ORDER BY pt.periode ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const createPiutangKaryawanRepo = async (piutangKaryawanData, req_id) => {
    piutangKaryawanData = removeDotInRupiahInput(piutangKaryawanData, [
        "nilai"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PiutangKaryawanModel,
        {
            pegawai: piutangKaryawanData.pegawai,
            periode: piutangKaryawanData.periode,
            nilai: piutangKaryawanData.nilai,
            tanggal: piutangKaryawanData.tanggal,
            bukti_transaksi: piutangKaryawanData.bukti_transaksi,
            keterangan: piutangKaryawanData.keterangan,
            kode_akun_perkiraan: piutangKaryawanData.kode_akun_perkiraan,
            enabled: piutangKaryawanData.enabled
        }
    )
}

export const deletePiutangKaryawanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PiutangKaryawanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePiutangKaryawanByUuidRepo = async (uuid, piutangKaryawanData, req_id) => {
    piutangKaryawanData = removeDotInRupiahInput(piutangKaryawanData, [
        "nilai"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PiutangKaryawanModel,
        {
            pegawai: piutangKaryawanData.pegawai,
            periode: piutangKaryawanData.periode,
            nilai: piutangKaryawanData.nilai,
            tanggal: piutangKaryawanData.tanggal,
            bukti_transaksi: piutangKaryawanData.bukti_transaksi,
            keterangan: piutangKaryawanData.keterangan,
            kode_akun_perkiraan: piutangKaryawanData.kode_akun_perkiraan,
        },
        {
            uuid
        }
    )
}