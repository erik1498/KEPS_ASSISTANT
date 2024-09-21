import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import GajiModel from "./gaji.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllGajiRepo = async (bulan, tahun, req_id) => {
    return await db.query(
        `
            SELECT 
                gt.uuid,
                gt.bukti_transaksi,
                0 AS transaksi,
                gt.tanggal,
                0 AS debet,
                gt.nilai AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                CONCAT("Gaji Pegawai") AS uraian,
                "GAJI PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                gt.enabled 
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = gt.kode_akun_perkiraan 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
            WHERE gt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(gt.tanggal) = ${tahun} AND MONTH(gt.tanggal) = ${bulan}
            UNION ALL 
            SELECT 
                gt.uuid,
                gt.bukti_transaksi,
                0 AS transaksi,
                gt.tanggal,
                gt.nilai AS debet,
                0 AS kredit,
                kapt.code AS kode_akun,
                kapt.name AS nama_akun,
                kapt.type AS type_akun,
                CONCAT("Gaji Pegawai") AS uraian,
                "GAJI PEGAWAI" AS sumber,
                pt.name AS pegawai_name,
                gt.enabled 
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "0c0a1c04-ad98-4818-9a63-9be554b2ae55" 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
            WHERE gt.enabled = 1
            AND kapt.enabled = 1
            AND YEAR(gt.tanggal) = ${tahun} AND MONTH(gt.tanggal) = ${bulan}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getSlipGajiByPegawaiUUIDRepo = async (uuid, bulan, tahun, req_id) => {
    const gajis = await db.query(
        `
            SELECT 
                gt.nilai AS nilai,
                "gaji" AS sumber
            FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
            WHERE gt.pegawai = "${uuid}"
            AND gt.periode = ${bulan}
            AND YEAR(gt.tanggal) = ${tahun}
            AND gt.enabled = 1
            UNION ALL
            SELECT 
                SUM(lt.total_bayaran) AS nilai,
                "lembur" AS sumber
            FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
            WHERE lt.pegawai = "${uuid}"
            AND lt.periode = ${bulan}
            AND YEAR(lt.tanggal) = ${tahun}
            AND lt.enabled = 1
            UNION ALL
            SELECT 
                tut.bpjs_kesehatan AS nilai,
                "bpjs_kesehatan" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL 
            SELECT 
                tut.jkk AS nilai,
                "jkk" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL 
            SELECT 
                tut.jkm AS nilai,
                "jkm" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL 
            SELECT 
                tut.jht AS nilai,
                "jht" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL 
            SELECT 
                tut.jp AS nilai,
                "jp" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL 
            SELECT 
                tut.bonus AS nilai,
                "bonus" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL 
            SELECT 
                tut.insentif AS nilai,
                "insentif" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL 
            SELECT 
                tut.thr AS nilai,
                "thr" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL 
            SELECT 
                SUM(ht.nilai) AS nilai,
                "hadiah" AS sumber
            FROM ${generateDatabaseName(req_id)}.hadiah_tab ht
            WHERE ht.pegawai = "${uuid}"
            AND ht.periode = ${bulan}
            AND YEAR(ht.tanggal) = ${tahun}
            AND ht.enabled = 1
            UNION ALL
            SELECT 
                SUM(pkt.nilai) AS nilai,
                "piutang_karyawan" AS sumber
            FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
            WHERE pkt.pegawai = "${uuid}"
            AND pkt.periode = ${bulan}
            AND YEAR(pkt.tanggal) = ${tahun}
            AND pkt.enabled = 1
            UNION ALL
            SELECT 
                tut.bpjs_karyawan AS nilai,
                "bpjs_karyawan" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut 
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL
            SELECT 
                tut.jht_karyawan AS nilai,
                "jht_karyawan" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut 
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL
            SELECT 
                tut.jp_karyawan AS nilai,
                "jp_karyawan" AS sumber
            FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut 
            WHERE tut.pegawai = "${uuid}"
            AND tut.periode = ${bulan}
            AND YEAR(tut.tanggal) = ${tahun}
            AND tut.enabled = 1
            UNION ALL
            SELECT 
                SUM(kt.nilai) AS nilai,
                "kerugian" AS sumber
            FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
            WHERE kt.pegawai = "${uuid}"
            AND kt.periode = ${bulan}
            AND YEAR(kt.tanggal) = ${tahun}
            AND kt.enabled = 1
            UNION ALL
            SELECT 
                SUM(llt.nilai) AS nilai,
                "lain_lain" AS sumber
            FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
            WHERE llt.pegawai = "${uuid}"
            AND llt.periode = ${bulan}
            AND YEAR(llt.tanggal) = ${tahun}
            AND llt.enabled = 1
            UNION ALL
            SELECT 
                pt.nilai AS nilai,
                "pph2126" AS sumber
            FROM ${generateDatabaseName(req_id)}.pph2126_tab pt 
            WHERE pt.pegawai = "${uuid}"
            AND pt.periode = ${bulan}
            AND YEAR(pt.tanggal) = ${tahun}
            AND pt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return gajis
}


export const getGajiByPegawaiUuidRepo = async (uuid, periode, tahun, req_id) => {
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
            AND gt.periode = "${periode}"
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