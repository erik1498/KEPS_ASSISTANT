import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PiutangKaryawanModel from "./piutangKaryawan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllPiutangKaryawanRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                pkt.uuid,
                pkt.bukti_transaksi,
                0 AS transaksi,
                pkt.tanggal,
                CASE 
                    WHEN pkt.type = 0
                    THEN pkt.nilai
                    ELSE 0
                END AS debet,
                CASE 
                    WHEN pkt.type = 1
                    THEN pkt.nilai
                    ELSE 0
                END AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                pkt.keterangan AS uraian,
                "PIUTANG KARYAWAN" AS sumber,
                pt.name AS pegawai_name,
                pkt.enabled 
            FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pkt.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
            WHERE pkt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(pkt.tanggal) = ${tahun} AND MONTH(pkt.tanggal) = ${bulan}
            UNION ALL
            SELECT 
                pkt.uuid,
                pkt.bukti_transaksi,
                0 AS transaksi,
                pkt.tanggal,
                CASE 
                    WHEN pkt.type = 1
                    THEN pkt.nilai
                    ELSE 0
                END AS debet,
                CASE 
                    WHEN pkt.type = 0
                    THEN pkt.nilai
                    ELSE 0
                END AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                pkt.keterangan AS uraian,
                "PIUTANG KARYAWAN" AS sumber,
                pt.name AS pegawai_name,
                pkt.enabled 
            FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "f15e2810-c736-42f6-9a80-6d70e03315de"
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
            WHERE pkt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(pkt.tanggal) = ${tahun} AND MONTH(pkt.tanggal) = ${bulan}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
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

export const getTotalPiutangKaryawanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                SUM(
                    CASE 
                        WHEN pkt.type = 1 THEN pkt.nilai * -1
                        ELSE pkt.nilai 
                    END
                ) AS total
            FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
            WHERE pkt.pegawai = "${uuid}"
            AND pkt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
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
            type: piutangKaryawanData.type,
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
            type: piutangKaryawanData.type,
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