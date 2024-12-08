import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarBahanBakuModel from "./daftarBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllDaftarBahanBakuRepo = async (pageNumber, size, search, req_id) => {
    const daftarBahanBakusCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt 
            JOIN ${generateDatabaseName(req_id)}.kategori_bahan_baku_tab kbt ON kbt.uuid = dbt.kategori_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.jenis_bahan_baku_tab jbt ON jbt.uuid = dbt.jenis_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.jenis_penjualan_bahan_baku_tab jpbt ON jpbt.uuid = dbt.jenis_penjualan_bahan_baku 
            WHERE dbt.name LIKE '%${search}%' 
            AND dbt.enabled = 1
            AND kbt.enabled = 1
            AND jbt.enabled = 1
            AND jpbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarBahanBakusCount[0].count

    const daftarBahanBakus = await db.query(
        `
            SELECT 
                dbt.*,
                kbt.name AS kategori_bahan_baku_name,
                jbt.name AS jenis_bahan_baku_name,
                jpbt.name AS jenis_penjualan_bahan_baku_name
            FROM ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt 
            JOIN ${generateDatabaseName(req_id)}.kategori_bahan_baku_tab kbt ON kbt.uuid = dbt.kategori_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.jenis_bahan_baku_tab jbt ON jbt.uuid = dbt.jenis_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.jenis_penjualan_bahan_baku_tab jpbt ON jpbt.uuid = dbt.jenis_penjualan_bahan_baku 
            WHERE dbt.name LIKE '%${search}%' 
            AND dbt.enabled = 1
            AND kbt.enabled = 1
            AND jbt.enabled = 1
            AND jpbt.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: daftarBahanBakus,
        count: daftarBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllDaftarBahanBakusAktifByDaftarGudangRepo = async (daftar_gudang, req_id) => {
    const daftarBahanBakus = await db.query(
        `
            SELECT 
                daftar_bahan_baku_tab.*
            FROM daftar_bahan_baku_tab 
            WHERE daftar_bahan_baku_tab.status = true
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return daftarBahanBakus
}

export const getAllDaftarBahanBakuUntukTransaksiRepo = async (req_id) => {
    const daftarBahanBakus = await db.query(
        `
            SELECT 
                khbt.*,
                sbt.name AS satuan_bahan_baku_name,
                dbt.name AS daftar_bahan_baku_name,
                dbt.ppn AS ppn,
                jbt.code AS jenis_bahan_baku_code
            FROM ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt ON dbt.uuid = khbt.daftar_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.jenis_bahan_baku_tab jbt ON jbt.uuid = dbt.jenis_bahan_baku
            WHERE dbt.enabled = 1
            AND dbt.status = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return daftarBahanBakus
}

export const getDaftarBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DaftarBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDaftarBahanBakuRepo = async (daftarBahanBakuData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBahanBakuModel,
        {
            name: daftarBahanBakuData.name,
            kategori_bahan_baku: daftarBahanBakuData.kategori_bahan_baku,
            jenis_bahan_baku: daftarBahanBakuData.jenis_bahan_baku,
            jenis_penjualan_bahan_baku: daftarBahanBakuData.jenis_penjualan_bahan_baku,
            ppn: daftarBahanBakuData.ppn,
            status: daftarBahanBakuData.status,
            enabled: daftarBahanBakuData.enabled
        }
    )
}

export const deleteDaftarBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDaftarBahanBakuByUuidRepo = async (uuid, daftarBahanBakuData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBahanBakuModel,
        {
            name: daftarBahanBakuData.name,
            kategori_bahan_baku: daftarBahanBakuData.kategori_bahan_baku,
            jenis_bahan_baku: daftarBahanBakuData.jenis_bahan_baku,
            jenis_penjualan_bahan_baku: daftarBahanBakuData.jenis_penjualan_bahan_baku,
            ppn: daftarBahanBakuData.ppn,
            status: daftarBahanBakuData.status,
        },
        {
            uuid
        }
    )
}

export const checkDaftarBahanBakuAllowToEditRepo = async (by_kategori_harga_bahan_baku, uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_penjualan_bahan_baku', ppbt.nomor_pesanan_penjualan_bahan_baku,
                            'tanggal', ppbt.tanggal_pesanan_penjualan_bahan_baku
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_bahan_baku_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_bahan_baku 
                    WHERE rppbt.stok_awal_bahan_baku = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_penjualan_bahan_baku, 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_pembelian_bahan_baku', ppbt.nomor_pesanan_pembelian_bahan_baku,
                            'tanggal', ppbt.tanggal_pesanan_pembelian_bahan_baku
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_bahan_baku 
                    WHERE rppbt.stok_awal_bahan_baku = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_pembelian_bahan_baku,
                (
                    SELECT 
                        JSON_OBJECT(
                            'kode_transfer_bahan_baku', tbt.kode_transfer_bahan_baku,
                            'tanggal', tbt.tanggal 
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_transfer_bahan_baku_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt ON tbt.uuid = rtbt.transfer_bahan_baku 
                    WHERE rtbt.enabled = 1
                    AND tbt.enabled = 1
                    AND (
                        rtbt.stok_awal_bahan_baku = sabt.uuid 
                        OR rtbt.stok_awal_bahan_baku_tujuan = sabt.uuid 
                    )
                    LIMIT 1
                ) AS transfer_bahan_baku,
                (
                    SELECT 
                        JSON_OBJECT(
                            'kode_konversi_bahan_baku', kbt.kode_konversi_bahan_baku,
                            'tanggal', kbt.tanggal 
                        )
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab rkbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab kbt ON kbt.uuid = rkbt.konversi_bahan_baku 
                    WHERE rkbt.enabled = 1
                    AND kbt.enabled = 1
                    AND (
                        rkbt.stok_awal_bahan_baku = sabt.uuid
                        OR rkbt.stok_awal_bahan_baku_tujuan = sabt.uuid
                    )
                    LIMIT 1
                ) AS konversi_bahan_baku,
                sabt.*
            FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt 
            ${by_kategori_harga_bahan_baku ? `WHERE sabt.kategori_harga_bahan_baku = "${uuid}"` : `WHERE sabt.daftar_bahan_baku = "${uuid}"`
        }
            AND sabt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}