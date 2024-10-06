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
                    ), 0) 
                    + 
                    IFNULL((
                        SELECT 
                            SUM(rppdbt.nilai_pelunasan)
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt
                        WHERE rppdbt.pelunasan_penjualan_barang = ppbt.uuid
                        AND rppdbt.enabled = 1
                    ), 0) AS total,
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
                    ), 0)AS total,
                    "retur_penjualan_barang" AS type
                FROM ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rpbt.kode_akun_perkiraan 
                WHERE rpbt.faktur_penjualan_barang = "${faktur_penjualan_barang_uuid}"
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.uuid AS uuid,
                    pdpbt.faktur_penjualan_barang AS faktur_penjualan_barang,
                    pdpbt.tanggal AS tanggal,
                    pdpbt.bukti_transaksi AS bukti_transaksi,
                    pdpbt.nomor_pengembalian_denda_penjualan_barang AS nomor_transaksi,
                    pdpbt.keterangan AS keterangan,
                    pdpbt.kode_akun_perkiraan AS kode_akun_perkiraan,
                    kapt.name AS kode_akun_perkiraan_name,
                    0 AS total,
                    "pengembalian_denda_penjualan_barang" AS type
                FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pdpbt.kode_akun_perkiraan 
                WHERE pdpbt.faktur_penjualan_barang = "${faktur_penjualan_barang_uuid}"
                AND pdpbt.enabled = 1
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

export const getTanggalTransaksiTerakhirByFakturPenjualanRepo = async (faktur_penjualan, tanggal_lama, tanggal_baru, req_id) => {
    const fakturPenjualans = await db.query(
        `
            SELECT 
                res.*,
                (
                    SELECT 
                        "pelunasan_penjualan_barang"
                    FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppt WHERE ppt.tanggal = res.tanggal_valid
                    AND ppt.enabled = 1
                    UNION ALL 
                    SELECT 
                        "retur_penjualan_barang"
                    FROM ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpt WHERE rpt.tanggal = res.tanggal_valid
                    AND rpt.enabled = 1
                    UNION ALL 
                    SELECT 
                        "pengembalian_denda_penjualan_barang"
                    FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpt WHERE pdpt.tanggal = res.tanggal_valid
                    AND pdpt.enabled = 1
                ) AS table_source
            FROM (
                SELECT 
                    res.*,
                    CASE 
                        WHEN res.tanggal_terakhir_transaksi = "${tanggal_lama}" AND res.tanggal_terakhir_transaksi_lewati_tanggal_baru <= "${tanggal_baru}"
                        THEN 1
                        ELSE 0
                    END allowToEdit,
                    CASE
                        WHEN res.tanggal_terakhir_transaksi > res.tanggal_terakhir_transaksi_lewati_tanggal_baru
                        THEN 
                            CASE 
                                WHEN res.tanggal_terakhir_transaksi < "${tanggal_lama}"
                                THEN 1
                                ELSE 0
                            END
                        ELSE 
                            CASE 
                                WHEN res.tanggal_terakhir_transaksi_lewati_tanggal_baru < "${tanggal_lama}"
                                THEN 1
                                ELSE 0
                            END
                    END AS allowToAdd,
                    CASE
                        WHEN res.tanggal_terakhir_transaksi > res.tanggal_terakhir_transaksi_lewati_tanggal_baru
                        THEN res.tanggal_terakhir_transaksi
                        ELSE res.tanggal_terakhir_transaksi_lewati_tanggal_baru
                    END AS tanggal_valid
                FROM (
                    SELECT
                        GREATEST(
                            fpbt.tanggal,
                            IFNULL((
                                SELECT MAX(ppbt2.tanggal) FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 WHERE ppbt2.faktur_penjualan_barang = fpbt.uuid 
                                AND ppbt2.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(rpt.tanggal) FROM ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpt WHERE rpt.faktur_penjualan_barang = fpbt.uuid 
                                AND rpt.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(pdpt.tanggal) FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpt WHERE pdpt.faktur_penjualan_barang = fpbt.uuid
                                AND pdpt.enabled = 1
                            ), fpbt.tanggal) 
                        ) AS tanggal_terakhir_transaksi,
                        GREATEST(
                            fpbt.tanggal,
                            IFNULL((
                                SELECT MAX(ppbt2.tanggal) FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 WHERE ppbt2.faktur_penjualan_barang = fpbt.uuid AND ppbt2.tanggal >= "${tanggal_baru}" AND ppbt2.tanggal < "${tanggal_lama}"
                                AND ppbt2.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(rpt.tanggal) FROM ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpt WHERE rpt.faktur_penjualan_barang = fpbt.uuid AND rpt.tanggal >= "${tanggal_baru}" AND rpt.tanggal < "${tanggal_lama}"
                                AND rpt.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(pdpt.tanggal) FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpt WHERE pdpt.faktur_penjualan_barang = fpbt.uuid AND pdpt.tanggal >= "${tanggal_baru}" AND pdpt.tanggal < "${tanggal_lama}"
                                AND pdpt.enabled = 1
                            ), fpbt.tanggal) 
                        ) AS tanggal_terakhir_transaksi_lewati_tanggal_baru
                    FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppt ON ppt.uuid = fpbt.pesanan_penjualan_barang 
                    WHERE fpbt.uuid = "${faktur_penjualan}"
                ) AS res
            ) AS res
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return fakturPenjualans
}

export const getJumlahRincianTransaksiOnTableByTanggalRepo = async (table_name, tanggal, req_id) => {
    const fakturPenjualans = await db.query(
        `
            SELECT 
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.rincian_${table_name}_tab rppt 
                    WHERE rppt.${table_name} = ppt.uuid 
                    AND ppt.enabled = 1
                    AND rppt.enabled = 1
                ) AS rincian_count,
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt 
                    WHERE ppt.faktur_penjualan_barang = ppt.faktur_penjualan_barang 
                    AND ppt.enabled = 1
                ) AS ${table_name}_count
            FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt WHERE ppt.tanggal = "${tanggal}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return fakturPenjualans
}


export const getJumlahRincianTransaksiDendaOnTableByTanggalRepo = async (table_name, tanggal, req_id) => {
    const fakturPenjualans = await db.query(
        `
            SELECT 
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppt 
                    WHERE rppt.${table_name} = ppt.uuid 
                    AND ppt.enabled = 1
                    AND rppt.enabled = 1
                ) AS rincian_denda_count,
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt 
                    WHERE ppt.faktur_penjualan_barang = ppt.faktur_penjualan_barang 
                    AND ppt.enabled = 1
                ) AS ${table_name}_denda_count
            FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt WHERE ppt.tanggal = "${tanggal}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return fakturPenjualans
}