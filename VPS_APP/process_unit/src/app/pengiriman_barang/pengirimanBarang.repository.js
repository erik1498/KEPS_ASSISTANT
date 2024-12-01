import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PengirimanBarangModel from "./pengirimanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPengirimanBarangRepo = async (pageNumber, size, search, req_id) => {
    const pengirimanBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.uuid = pbt.faktur_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = fpbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pbt.pegawai_penanggung_jawab 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt2 ON pt2.uuid = pbt.pegawai_pelaksana 
            WHERE CONCAT(pbt.nomor_surat_jalan, fpbt.nomor_faktur_penjualan_barang) LIKE '%${search}%' 
            AND pbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pengirimanBarangsCount[0].count

    const pengirimanBarangs = await db.query(
        `
            SELECT 
                pbt.*,
                ct.name AS customer_name,
                ct.code AS customer_code,
                ct.alamat_kantor AS customer_alamat_kantor,
                ct.no_hp AS customer_no_hp,
                ppbt.nomor_pesanan_penjualan_barang AS nomor_pesanan_penjualan_barang,
                fpbt.nomor_faktur_penjualan_barang,
                pt.name AS pegawai_penanggung_jawab_name,
                pt2.name AS pegawai_pelaksana_name
            FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.uuid = pbt.faktur_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = fpbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pbt.pegawai_penanggung_jawab 
            JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt2 ON pt2.uuid = pbt.pegawai_pelaksana 
            WHERE CONCAT(pbt.nomor_surat_jalan, fpbt.nomor_faktur_penjualan_barang) LIKE '%${search}%' 
            AND pbt.enabled = 1
            ORDER BY pbt.tanggal DESC
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pengirimanBarangs,
        count: pengirimanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDaftarPesananByUUIDRepo = async (pengiriman_barang, req_id) => {
    return await db.query(`
            SELECT 
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                dgt.name AS daftar_gudang_name,
                dbt.name AS daftar_barang_name,
                sbt.name AS satuan_barang_name,
                rppbt.jumlah - IFNULL((
                    SELECT 
                        SUM(rpbt.pengiriman)
                    FROM ${generateDatabaseName(req_id)}.rincian_pengiriman_barang_tab rpbt 
                    JOIN ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt ON pbt.uuid = rpbt.pengiriman_barang 
                    WHERE rpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                    AND pbt.tanggal < (
                        SELECT 
                            pbt2.tanggal 
                        FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt2 
                        WHERE pbt2.uuid = "${pengiriman_barang}"
                    )
                    AND pbt.enabled = 1
                ), 0) AS jumlah,
                rppbt.uuid AS rincian_pesanan_penjualan_barang,
                IFNULL((
                    SELECT rpbt.pengiriman FROM ${generateDatabaseName(req_id)}.rincian_pengiriman_barang_tab rpbt 
                    WHERE rpbt.pengiriman_barang = "${pengiriman_barang}"
                    AND rpbt.rincian_pesanan_penjualan_barang = rppbt.uuid 
                ), 0) AS pengiriman,
                IFNULL((
                    SELECT rpbt.uuid FROM ${generateDatabaseName(req_id)}.rincian_pengiriman_barang_tab rpbt 
                    WHERE rpbt.pengiriman_barang = "${pengiriman_barang}"
                    AND rpbt.rincian_pesanan_penjualan_barang = rppbt.uuid 
                ), "") AS uuid
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            WHERE rppbt.enabled = 1
            AND fpbt.uuid = (
                SELECT 
                    pbt.faktur_penjualan_barang 
                FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt 
                WHERE pbt.uuid = "${pengiriman_barang}"
            )
            ORDER BY rppbt.createdAt DESC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getPengirimanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PengirimanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPengirimanBarangRepo = async (pengirimanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengirimanBarangModel,
        {
            tanggal: pengirimanBarangData.tanggal,
            nomor_surat_jalan: pengirimanBarangData.nomor_surat_jalan,
            faktur_penjualan_barang: pengirimanBarangData.faktur_penjualan_barang,
            pegawai_penanggung_jawab: pengirimanBarangData.pegawai_penanggung_jawab,
            pegawai_pelaksana: pengirimanBarangData.pegawai_pelaksana,
            enabled: pengirimanBarangData.enabled
        }
    )
}

export const deletePengirimanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengirimanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePengirimanBarangByUuidRepo = async (uuid, pengirimanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PengirimanBarangModel,
        {
            nomor_surat_jalan: pengirimanBarangData.nomor_surat_jalan,
            pegawai_penanggung_jawab: pengirimanBarangData.pegawai_penanggung_jawab,
            pegawai_pelaksana: pengirimanBarangData.pegawai_pelaksana,
        },
        {
            uuid
        }
    )
}

export const checkNomorSuratJalanAndTanggalRepo = async (pengirimanBarangData, req_id) => {
    return await db.query(
        `
            SELECT 
            (
                SELECT 
                    pbt.tanggal 
                FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt 
                WHERE pbt.faktur_penjualan_barang = "${pengirimanBarangData.faktur_penjualan_barang}"
                AND pbt.enabled = 1
                ${pengirimanBarangData.uuid ? `AND pbt.uuid != "${pengirimanBarangData.uuid}"` : ""}
                ORDER BY pbt.tanggal DESC
                LIMIT 1
            ) AS tanggal_terakhir,
            (
                SELECT 
                    pbt.nomor_surat_jalan
                FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt 
                WHERE pbt.nomor_surat_jalan = "${pengirimanBarangData.nomor_surat_jalan}"
                AND pbt.enabled = 1
                ${pengirimanBarangData.uuid ? `AND pbt.uuid != "${pengirimanBarangData.uuid}"` : ""}
            ) AS nomor_surat_jalan
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}