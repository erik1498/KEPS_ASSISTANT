import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PerintahStokOpnameModel from "./perintahStokOpname.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPerintahStokOpnameRepo = async (pageNumber, size, search, req_id) => {
    const perintahStokOpnamesCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
            WHERE psot.tanggal LIKE '%${search}%'
            AND psot.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : perintahStokOpnamesCount[0].count

    const perintahStokOpnames = await db.query(
        `
            SELECT 
                psot.*,
                IFNULL((
                    SELECT 
                        ppt.tanggal 
                    FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                    WHERE ppt.perintah_stok_opname = psot.uuid 
                    AND ppt.enabled = 1
                    LIMIT 1
                ), "BELUM SELESAI") AS tanggal_selesai,
                IFNULL((
                    SELECT COUNT(0) FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot WHERE hsot.perintah_stok_opname = psot.uuid AND hsot.enabled = 1
                ), 0 ) AS hasil_stok_opname_count,
                IFNULL((
                    SELECT COUNT(0) FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt WHERE ppt.perintah_stok_opname = psot.uuid AND ppt.enabled = 1
                ), 0 ) AS penyesuaian_persediaan_count,
                pt.name AS pegawai_penanggung_jawab_name,
                pt2.name AS pegawai_pelaksana_name,
                kbt.name AS kategori_barang_name,
                dgt.name AS daftar_gudang_name
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON psot.pegawai_penanggung_jawab = pt.uuid
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt2 ON psot.pegawai_pelaksana = pt2.uuid 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON psot.gudang_asal = dgt.uuid 
            JOIN ${generateDatabaseName(req_id)}.kategori_barang_tab kbt ON psot.kategori_barang = kbt.uuid 
            WHERE psot.tanggal LIKE '%${search}%'
            AND psot.enabled = 1 
            ORDER BY psot.tanggal ASC
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: perintahStokOpnames,
        count: perintahStokOpnamesCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPerintahStokOpnameByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPerintahStokOpnameRepo = async (perintahStokOpnameData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
            tanggal: perintahStokOpnameData.tanggal,
            nomor_surat_perintah: perintahStokOpnameData.nomor_surat_perintah,
            pegawai_penanggung_jawab: perintahStokOpnameData.pegawai_penanggung_jawab,
            pegawai_pelaksana: perintahStokOpnameData.pegawai_pelaksana,
            kategori_barang: perintahStokOpnameData.kategori_barang,
            gudang_asal: perintahStokOpnameData.gudang_asal,
            validasi: perintahStokOpnameData.validasi,
            enabled: perintahStokOpnameData.enabled
        }
    )
}

export const deletePerintahStokOpnameByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePerintahStokOpnameByUuidRepo = async (uuid, perintahStokOpnameData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PerintahStokOpnameModel,
        {
            tanggal: perintahStokOpnameData.tanggal,
            nomor_surat_perintah: perintahStokOpnameData.nomor_surat_perintah,
            pegawai_penanggung_jawab: perintahStokOpnameData.pegawai_penanggung_jawab,
            pegawai_pelaksana: perintahStokOpnameData.pegawai_pelaksana,
            kategori_barang: perintahStokOpnameData.kategori_barang,
            gudang_asal: perintahStokOpnameData.gudang_asal,
            validasi: perintahStokOpnameData.validasi,
        },
        {
            uuid
        }
    )
}

export const getStatusPerintahStokOpnameAktifByTanggalRepo = async (tanggal, uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*,
                CASE 
                    WHEN res.tanggal_selesai != "BELUM SELESAI"
                    THEN 
                        CASE
                            WHEN res.tanggal_selesai >= "${tanggal}"
                            THEN 0
                            ELSE 1
                        END
                    ELSE 0
                END AS allowToExecute
            FROM (
                SELECT  
                    psot.uuid,
                    psot.tanggal,
                    IFNULL((
                        SELECT 
                            ppt.tanggal 
                        FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                        WHERE ppt.perintah_stok_opname = psot.uuid 
                        LIMIT 1
                    ), "BELUM SELESAI") AS tanggal_selesai,
                    psot.nomor_surat_perintah
                FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
                WHERE psot.tanggal <= "${tanggal}"
                ${uuid ? `AND psot.uuid != "${uuid}"` : ``}
                AND psot.enabled = 1
            ) AS res
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const perintahStokOpnameStatusRepo = async (perintah_stok_opname, req_id) => {
    const perintahStokOpname = await db.query(
        `
            SELECT 
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot
                    WHERE hsot.perintah_stok_opname = psot.uuid 
                    AND hsot.enabled = 1
                ) AS hasil_stok_opname,
                (
                    SELECT
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt
                    WHERE ppt.perintah_stok_opname = psot.uuid 
                    AND ppt.enabled = 1
                ) AS penyesuaian_persediaan,
                (
                    SELECT 
                        COUNT(0)
                    FROM ${generateDatabaseName(req_id)}.neraca_tab nt 
                    WHERE nt.bulan = MONTH(psot.tanggal) AND nt.tahun = YEAR(psot.tanggal)
                ) AS status_validasi,
                YEAR(psot.tanggal) AS tahun,
                MONTH(psot.tanggal) AS bulan
            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
            WHERE psot.uuid = "${perintah_stok_opname}"
            AND psot.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return perintahStokOpname
}