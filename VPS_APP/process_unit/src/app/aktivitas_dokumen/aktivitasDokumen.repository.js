import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import AktivitasDokumenModel from "./aktivitasDokumen.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllAktivitasDokumenRepo = async (tahun, pageNumber, size, search, req_id) => {
    const aktivitasDokumensCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM (
                SELECT 
                    adt.*
                FROM ${generateDatabaseName(req_id)}.aktivitas_dokumen_tab adt
                WHERE adt.tanggal >= "01-01-${tahun}" AND adt.tanggal <= "31-12-${tahun}"
                AND adt.enabled = 1
                ORDER BY adt.tanggal DESC
            ) AS res
            WHERE res.klien LIKE '%${search}%'
            OR res.penanggung_jawab LIKE '%${search}%'
            OR res.jenis_dokumen LIKE '%${search}%'
            OR res.kategori_dokumen LIKE '%${search}%'
            OR res.tipe_dokumen LIKE '%${search}%'
            OR res.no_surat LIKE '%${search}%'
            OR res.tanggal LIKE '%${search}%'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : aktivitasDokumensCount[0].count

    const aktivitasDokumens = await db.query(
        `
            SELECT 
                (
                    SELECT 
                        sradt.tanggal
                    FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_tab sradt 
                    WHERE sradt.riwayat_aktivitas_dokumen = res.riwayat_aktivitas_uuid
                    AND sradt.enabled = 1
                    ORDER BY sradt.tanggal DESC 
                    LIMIT 1
                ) AS tanggal_status_riwayat_aktivitas_terakhir, 
                (
                    SELECT 
                        sradt.judul_status
                    FROM ${generateDatabaseName(req_id)}.status_riwayat_aktivitas_dokumen_tab sradt 
                    WHERE sradt.riwayat_aktivitas_dokumen = res.riwayat_aktivitas_uuid
                    AND sradt.enabled = 1
                    ORDER BY sradt.tanggal DESC 
                    LIMIT 1
                ) AS judul_status_riwayat_aktivitas_terakhir,
                (
                    SELECT 
                        res.biaya - IFNULL(SUM(rpadt.nilai_pembayaran), 0)
                    FROM ${generateDatabaseName(req_id)}.riwayat_pembayaran_aktivitas_dokumen_tab rpadt 
                    WHERE rpadt.aktivitas_dokumen = res.uuid
                    AND rpadt.enabled = 1
                ) AS hutang,
                (
                    SELECT 
                        COUNT(0) AS count
                    FROM ${generateDatabaseName(req_id)}.dokumen_klien_tab dkt 
                    WHERE dkt.aktivitas_dokumen = res.uuid
                    AND enabled = 1
                ) AS jumlah_dokumen,
                res.*
            FROM (
                SELECT 
                    (
                        SELECT 
                            radt.uuid
                        FROM ${generateDatabaseName(req_id)}.riwayat_aktivitas_dokumen_tab radt 
                        WHERE radt.aktivitas_dokumen = adt.uuid
                        AND radt.enabled = 1 
                        ORDER BY radt.tanggal DESC 
                        LIMIT 1
                    ) AS riwayat_aktivitas_uuid, 
                    (
                        SELECT 
                            radt.tanggal
                        FROM ${generateDatabaseName(req_id)}.riwayat_aktivitas_dokumen_tab radt 
                        WHERE radt.aktivitas_dokumen = adt.uuid
                        AND radt.enabled = 1 
                        ORDER BY radt.tanggal DESC 
                        LIMIT 1
                    ) AS tanggal_riwayat_aktivitas_uuid, 
                    (
                        SELECT 
                            radt.judul_aktivitas
                        FROM ${generateDatabaseName(req_id)}.riwayat_aktivitas_dokumen_tab radt 
                        WHERE radt.aktivitas_dokumen = adt.uuid
                        AND radt.enabled = 1 
                        ORDER BY radt.tanggal DESC 
                        LIMIT 1
                    ) AS judul_riwayat_aktivitas_uuid,
                    adt.*
                FROM ${generateDatabaseName(req_id)}.aktivitas_dokumen_tab adt
                WHERE adt.tanggal >= "01-01-${tahun}" AND adt.tanggal <= "31-12-${tahun}"
                AND adt.enabled = 1
                ORDER BY adt.tanggal DESC
            ) AS res
            WHERE res.klien LIKE '%${search}%'
            OR res.penanggung_jawab LIKE '%${search}%'
            OR res.jenis_dokumen LIKE '%${search}%'
            OR res.kategori_dokumen LIKE '%${search}%'
            OR res.tipe_dokumen LIKE '%${search}%'
            OR res.no_surat LIKE '%${search}%'
            OR res.tanggal LIKE '%${search}%'
            LIMIT ${pageNumber}, ${size} 
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: aktivitasDokumens,
        count: aktivitasDokumensCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAktivitasDokumenByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        AktivitasDokumenModel,
        null,
        {
            uuid
        }
    )
}

export const createAktivitasDokumenRepo = async (aktivitasDokumenData, req_id) => {
    aktivitasDokumenData = removeDotInRupiahInput(aktivitasDokumenData, [
        "biaya"
    ])
    return insertQueryUtil(
        generateDatabaseName(req_id),
        AktivitasDokumenModel,
        {
            tanggal: aktivitasDokumenData.tanggal,
            no_surat: aktivitasDokumenData.no_surat,
            tipe_dokumen: aktivitasDokumenData.tipe_dokumen,
            kategori_dokumen: aktivitasDokumenData.kategori_dokumen,
            jenis_dokumen: aktivitasDokumenData.jenis_dokumen,
            klien: aktivitasDokumenData.klien,
            penanggung_jawab: aktivitasDokumenData.penanggung_jawab,
            biaya: aktivitasDokumenData.biaya,
            keterangan: aktivitasDokumenData.keterangan,
            enabled: aktivitasDokumenData.enabled
        }
    )
}

export const deleteAktivitasDokumenByUuidRepo = async (uuid, req_id) => {
    return updateQueryUtil(
        generateDatabaseName(req_id),
        AktivitasDokumenModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateAktivitasDokumenByUuidRepo = async (uuid, aktivitasDokumenData, req_id) => {
    aktivitasDokumenData = removeDotInRupiahInput(aktivitasDokumenData, [
        "biaya"
    ])
    return updateQueryUtil(
        generateDatabaseName(req_id),
        AktivitasDokumenModel,
        {
            tanggal: aktivitasDokumenData.tanggal,
            no_surat: aktivitasDokumenData.no_surat,
            tipe_dokumen: aktivitasDokumenData.tipe_dokumen,
            kategori_dokumen: aktivitasDokumenData.kategori_dokumen,
            jenis_dokumen: aktivitasDokumenData.jenis_dokumen,
            klien: aktivitasDokumenData.klien,
            penanggung_jawab: aktivitasDokumenData.penanggung_jawab,
            biaya: aktivitasDokumenData.biaya,
            keterangan: aktivitasDokumenData.keterangan,
            enabled: 1
        },
        {
            uuid
        }
    )
}

export const getCountAktivitasDokumenRepo = async (req_id) => {
    const aktivitasDokumen = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.aktivitas_dokumen_tab adt
            WHERE enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
    return aktivitasDokumen
}