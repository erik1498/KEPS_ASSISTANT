import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import FakturPenjualanBarangModel from "./fakturPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllFakturPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const fakturPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab WHERE pesanan_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : fakturPenjualanBarangsCount[0].count

    const fakturPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab WHERE pesanan_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: fakturPenjualanBarangs,
        count: fakturPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRiwayatTransaksiPenjualanBarangByFakturPenjualanBarangUUIDRepo = async (faktur_penjualan_barang_uuid, req_id) => {
    return await db.query(
        `
            SELECT
                res.*
            FROM (
                SELECT 
                    ppbt.uuid AS uuid,
                    ppbt.faktur_penjualan_barang AS faktur_penjualan_barang,
                    ppbt.tanggal AS tanggal ,
                    ppbt.bukti_transaksi AS bukti_transaksi,
                    ppbt.nomor_pelunasan_penjualan_barang AS nomor_transaksi,
                    ppbt.keterangan AS keterangan,
                    ppbt.kode_akun_perkiraan AS kode_akun_perkiraan,
                    kapt.name AS kode_akun_perkiraan_name,
                    IFNULL((
                        SELECT 
                            SUM(rppbt.nilai_pelunasan)
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt
                        WHERE rppbt.pelunasan_penjualan_barang = ppbt.uuid
                        AND rppbt.enabled = 1
                    ),0)AS total,
                    "pelunasan_penjualan_barang" AS type
                FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppbt.kode_akun_perkiraan 
                WHERE ppbt.faktur_penjualan_barang = "${faktur_penjualan_barang_uuid}"
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.uuid AS uuid,
                    rpbt.faktur_penjualan_barang AS faktur_penjualan_barang,
                    rpbt.tanggal AS tanggal ,
                    rpbt.bukti_transaksi AS bukti_transaksi,
                    rpbt.nomor_retur_penjualan_barang AS nomor_transaksi,
                    rpbt.keterangan AS keterangan,
                    rpbt.kode_akun_perkiraan AS kode_akun_perkiraan,
                    kapt.name AS kode_akun_perkiraan_name,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur)
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt
                        WHERE rrpbt.retur_penjualan_barang = rpbt.uuid
                        AND rrpbt.enabled = 1
                    ),0)AS total,
                    "retur_penjualan_barang" AS type
                FROM ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rpbt.kode_akun_perkiraan 
                WHERE rpbt.faktur_penjualan_barang = "${faktur_penjualan_barang_uuid}"
                AND rpbt.enabled = 1
            ) AS res
            ORDER BY res.tanggal DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getFakturPenjualanBarangByPesananPenjualanBarangUUIDRepo = async (pesanan_penjualan_barang_uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                fpbt.*, 
                tpt.name AS tipe_pembayaran_name,
                spt.name AS syarat_pembayaran_name
            FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt 
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = fpbt.tipe_pembayaran
            JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
            WHERE fpbt.pesanan_penjualan_barang = "${pesanan_penjualan_barang_uuid}"
            AND fpbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getFakturPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        FakturPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createFakturPenjualanBarangRepo = async (fakturPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanBarangModel,
        {
            pesanan_penjualan_barang: fakturPenjualanBarangData.pesanan_penjualan_barang,
            tanggal: fakturPenjualanBarangData.tanggal,
            nomor_faktur_penjualan_barang: fakturPenjualanBarangData.nomor_faktur_penjualan_barang,
            bukti_transaksi: fakturPenjualanBarangData.bukti_transaksi,
            tipe_pembayaran: fakturPenjualanBarangData.tipe_pembayaran,
            syarat_pembayaran: fakturPenjualanBarangData.syarat_pembayaran,
            keterangan: fakturPenjualanBarangData.keterangan,
            nomor_faktur_pajak_penjualan_barang: fakturPenjualanBarangData.nomor_faktur_pajak_penjualan_barang,
            enabled: fakturPenjualanBarangData.enabled
        }
    )
}

export const deleteFakturPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateFakturPenjualanBarangByUuidRepo = async (uuid, fakturPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanBarangModel,
        {
            pesanan_penjualan_barang: fakturPenjualanBarangData.pesanan_penjualan_barang,
            tanggal: fakturPenjualanBarangData.tanggal,
            nomor_faktur_penjualan_barang: fakturPenjualanBarangData.nomor_faktur_penjualan_barang,
            bukti_transaksi: fakturPenjualanBarangData.bukti_transaksi,
            tipe_pembayaran: fakturPenjualanBarangData.tipe_pembayaran,
            syarat_pembayaran: fakturPenjualanBarangData.syarat_pembayaran,
            keterangan: fakturPenjualanBarangData.keterangan,
            nomor_faktur_pajak_penjualan_barang: fakturPenjualanBarangData.nomor_faktur_pajak_penjualan_barang,
        },
        {
            uuid
        }
    )
}