import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarBarangModel from "./daftarBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllDaftarBarangRepo = async (pageNumber, size, search, req_id) => {
    const daftarBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_barang_tab dbt 
            JOIN ${generateDatabaseName(req_id)}.kategori_barang_tab kbt ON kbt.uuid = dbt.kategori_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_penjualan_barang_tab jpbt ON jpbt.uuid = dbt.jenis_penjualan_barang 
            WHERE dbt.name LIKE '%${search}%' 
            AND dbt.enabled = 1
            AND kbt.enabled = 1
            AND jbt.enabled = 1
            AND jpbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarBarangsCount[0].count

    const daftarBarangs = await db.query(
        `
            SELECT 
                dbt.*,
                kbt.name AS kategori_barang_name,
                jbt.name AS jenis_barang_name,
                jpbt.name AS jenis_penjualan_barang_name
            FROM ${generateDatabaseName(req_id)}.daftar_barang_tab dbt 
            JOIN ${generateDatabaseName(req_id)}.kategori_barang_tab kbt ON kbt.uuid = dbt.kategori_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_penjualan_barang_tab jpbt ON jpbt.uuid = dbt.jenis_penjualan_barang 
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
        entry: daftarBarangs,
        count: daftarBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllDaftarBarangsAktifByDaftarGudangRepo = async (daftar_gudang, req_id) => {
    const daftarBarangs = await db.query(
        `
            SELECT 
                daftar_barang_tab.*
            FROM daftar_barang_tab 
            WHERE daftar_barang_tab.status = true
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return daftarBarangs
}

export const getAllDaftarBarangUntukTransaksiRepo = async (req_id) => {
    const daftarBarangs = await db.query(
        `
            SELECT 
                khbt.*,
                sbt.name AS satuan_barang_name,
                dbt.name AS daftar_barang_name,
                dbt.ppn AS ppn,
                jbt.code AS jenis_barang_code
            FROM ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang
            WHERE dbt.enabled = 1
            AND dbt.status = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return daftarBarangs
}

export const getDaftarBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DaftarBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDaftarBarangRepo = async (daftarBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBarangModel,
        {
            name: daftarBarangData.name,
            kategori_barang: daftarBarangData.kategori_barang,
            jenis_barang: daftarBarangData.jenis_barang,
            jenis_penjualan_barang: daftarBarangData.jenis_penjualan_barang,
            ppn: daftarBarangData.ppn,
            status: daftarBarangData.status,
            enabled: daftarBarangData.enabled
        }
    )
}

export const deleteDaftarBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDaftarBarangByUuidRepo = async (uuid, daftarBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarBarangModel,
        {
            name: daftarBarangData.name,
            kategori_barang: daftarBarangData.kategori_barang,
            jenis_barang: daftarBarangData.jenis_barang,
            jenis_penjualan_barang: daftarBarangData.jenis_penjualan_barang,
            ppn: daftarBarangData.ppn,
            status: daftarBarangData.status,
        },
        {
            uuid
        }
    )
}

export const checkDaftarBarangAllowToEditRepo = async (by_kategori_harga_barang, uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                            'tanggal', ppbt.tanggal_pesanan_penjualan_barang
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
                    WHERE rppbt.stok_awal_barang = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_penjualan_barang, 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                            'tanggal', ppbt.tanggal_pesanan_pembelian_barang
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
                    WHERE rppbt.stok_awal_barang = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_pembelian_barang,
                (
                    SELECT 
                        JSON_OBJECT(
                            'kode_transfer_barang', tbt.kode_transfer_barang,
                            'tanggal', tbt.tanggal 
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
                    WHERE rtbt.enabled = 1
                    AND tbt.enabled = 1
                    AND (
                        rtbt.stok_awal_barang = sabt.uuid 
                        OR rtbt.stok_awal_barang_tujuan = sabt.uuid 
                    )
                    LIMIT 1
                ) AS transfer_barang,
                (
                    SELECT 
                        JSON_OBJECT(
                            'kode_konversi_barang', kbt.kode_konversi_barang,
                            'tanggal', kbt.tanggal 
                        )
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rkbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab kbt ON kbt.uuid = rkbt.konversi_barang 
                    WHERE rkbt.enabled = 1
                    AND kbt.enabled = 1
                    AND (
                        rkbt.stok_awal_barang = sabt.uuid
                        OR rkbt.stok_awal_barang_tujuan = sabt.uuid
                    )
                    LIMIT 1
                ) AS konversi_barang,
                sabt.*
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt 
            ${by_kategori_harga_barang ? `WHERE sabt.kategori_harga_barang = "${uuid}"` : `WHERE sabt.daftar_barang = "${uuid}"`
        }
            AND sabt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}