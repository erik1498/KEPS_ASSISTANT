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

export const getFakturReportPenjualanBarangsRepo = async (pageNumber, size, search, req_id) => {
    const fakturPenjualanBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM (
                SELECT 
                    IFNULL((
                        SELECT 
                            SUM(rppbt.total_harga)
                        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                        WHERE rppbt.enabled = 1
                        AND rppbt.pesanan_penjualan_barang = fpbt.pesanan_penjualan_barang
                    ), 0) AS total_beli,
                    IFNULL((
                        SELECT 
                            rrpbt.nilai_retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rrpbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND rpbt.faktur_penjualan_barang = fpbt.uuid 
                        ORDER BY rpbt.tanggal DESC 
                        LIMIT 1
                    ), 0) AS total_retur, 
                    IFNULL((
                        SELECT 
                            rppbt.sudah_dibayar 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt.pelunasan_penjualan_barang 
                        WHERE rppbt.enabled = 1
                        AND ppbt2.enabled = 1
                        AND ppbt2.faktur_penjualan_barang = fpbt.uuid 
                        ORDER BY ppbt2.tanggal DESC
                        LIMIT 1
                    ), 0) AS total_pelunasan,
                    fpbt.tanggal,
                    fpbt.nomor_faktur_penjualan_barang,
                    fpbt.bukti_transaksi AS bukti_transaksi_faktur,
                    ppbt.nomor_pesanan_penjualan_barang,
                    ct.name AS customer_name,
                    ct.code AS customer_code
                FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = fpbt.pesanan_penjualan_barang 
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
            ) AS res
            WHERE CONCAT(
                res.nomor_faktur_penjualan_barang,
                res.bukti_transaksi_faktur,
                res.nomor_pesanan_penjualan_barang,
                res.customer_name,
                res.customer_code
            ) 
            LIKE '%${search}%' 
            AND res.total_beli - (res.total_pelunasan - res.total_retur) > 0
            ORDER BY res.tanggal DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : fakturPenjualanBarangsCount[0].count

    const fakturPenjualanBarangs = await db.query(
        `
            SELECT 
                res.total_beli - (res.total_pelunasan - res.total_retur) AS piutang,
                res.*
            FROM (
                SELECT 
                    IFNULL((
                        SELECT 
                            SUM(rppbt.total_harga)
                        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                        WHERE rppbt.enabled = 1
                        AND rppbt.pesanan_penjualan_barang = fpbt.pesanan_penjualan_barang
                    ), 0) AS total_beli,
                    IFNULL((
                        SELECT 
                            rrpbt.nilai_retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rrpbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND rpbt.faktur_penjualan_barang = fpbt.uuid 
                        ORDER BY rpbt.tanggal DESC 
                        LIMIT 1
                    ), 0) AS total_retur, 
                    IFNULL((
                        SELECT 
                            rppbt.sudah_dibayar 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt.pelunasan_penjualan_barang 
                        WHERE rppbt.enabled = 1
                        AND ppbt2.enabled = 1
                        AND ppbt2.faktur_penjualan_barang = fpbt.uuid 
                        ORDER BY ppbt2.tanggal DESC
                        LIMIT 1
                    ), 0) AS total_pelunasan,
                    fpbt.tanggal,
                    fpbt.nomor_faktur_penjualan_barang,
                    fpbt.bukti_transaksi AS bukti_transaksi_faktur,
                    ppbt.nomor_pesanan_penjualan_barang,
                    ct.name AS customer_name,
                    ct.code AS customer_code
                FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = fpbt.pesanan_penjualan_barang 
                JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
            ) AS res
            WHERE CONCAT(
                res.nomor_faktur_penjualan_barang,
                res.bukti_transaksi_faktur,
                res.nomor_pesanan_penjualan_barang,
                res.customer_name,
                res.customer_code
            ) 
            LIKE '%${search}%'
            AND res.total_beli - (res.total_pelunasan - res.total_retur) > 0
            ORDER BY res.tanggal DESC
            LIMIT ${pageNumber}, ${size}
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
                    kapt.code AS kode_akun_perkiraan_code,
                    (
                        SELECT 
                            JSON_OBJECT(
                                'nomor_perintah_stok_opname', psot.nomor_surat_perintah,
                                'hasil_stok_opname_count', IFNULL((
                                    SELECT 
                                        COUNT(0) 
                                    FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot 
                                    WHERE hsot.perintah_stok_opname = psot.uuid 
                                    AND hsot.enabled = 1
                                ), 0)
                            )
                        FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
                        WHERE psot.enabled = 1
                        AND psot.bulan_transaksi = MONTH(ppbt.tanggal)
                        AND psot.tahun = YEAR(ppbt.tanggal)
                        LIMIT 1
                    ) AS perintah_stok_opname_nomor_surat_perintah,
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
                    kapt.code AS kode_akun_perkiraan_code,
                    (
                        SELECT 
                            JSON_OBJECT(
                                'nomor_perintah_stok_opname', psot.nomor_surat_perintah,
                                'hasil_stok_opname_count', IFNULL((
                                    SELECT 
                                        COUNT(0) 
                                    FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot 
                                    WHERE hsot.perintah_stok_opname = psot.uuid 
                                    AND hsot.enabled = 1
                                ), 0)
                            )
                        FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
                        WHERE psot.enabled = 1
                        AND psot.bulan_transaksi = MONTH(rpbt.tanggal)
                        AND psot.tahun = YEAR(rpbt.tanggal)
                        LIMIT 1
                    ) AS perintah_stok_opname_nomor_surat_perintah,
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
                    kapt.code AS kode_akun_perkiraan_code,
                    (
                        SELECT 
                            JSON_OBJECT(
                                'nomor_perintah_stok_opname', psot.nomor_surat_perintah,
                                'hasil_stok_opname_count', IFNULL((
                                    SELECT 
                                        COUNT(0) 
                                    FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot 
                                    WHERE hsot.perintah_stok_opname = psot.uuid 
                                    AND hsot.enabled = 1
                                ), 0)
                            )
                        FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot 
                        WHERE psot.enabled = 1
                        AND psot.bulan_transaksi = MONTH(pdpbt.tanggal)
                        AND psot.tahun = YEAR(pdpbt.tanggal)
                        LIMIT 1
                    ) AS perintah_stok_opname_nomor_surat_perintah,
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

export const getRincianPesananPenjualanBarangByFakturPenjualanBarangUUIDRepo = async (faktur_penjualan_barang, req_id) => {
    return await db.query(
        `
            SELECT 
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                dbt.name AS daftar_barang_name,
                dgt.name AS daftar_gudang_name,
                sbt.name AS satuan_barang_name,
                jbt.code AS jenis_barang_code,
                rppbt.*
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang 
            WHERE fpbt.uuid = "${faktur_penjualan_barang}"
            AND ppbt.enabled = 1
            AND rppbt.enabled = 1
            ORDER BY rppbt.id DESC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRincianPengirimanBarangByFakturPenjualanBarangUUIDRepo = async (faktur_penjualan_barang, rincian_pesanan_penjualan_barang_list, req_id) => {
    return await db.query(
        `
            SELECT 
                pbt.nomor_surat_jalan,
                pbt.tanggal,
                rpbt.jumlah,
                rpbt.rincian_pesanan_penjualan_barang 
            FROM ${generateDatabaseName(req_id)}.rincian_pengiriman_barang_tab rpbt 
            JOIN ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt ON pbt.uuid = rpbt.pengiriman_barang 
            WHERE rpbt.rincian_pesanan_penjualan_barang IN ("${rincian_pesanan_penjualan_barang_list.join('","')}")
            AND pbt.faktur_penjualan_barang = "${faktur_penjualan_barang}"
            AND pbt.enabled = 1
            AND rpbt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getFakturPenjualanBarangByPesananPenjualanBarangUUIDRepo = async (pesanan_penjualan_barang, req_id) => {
    return await db.query(
        `
            SELECT 
                fpbt.*, 
                tpt.name AS tipe_pembayaran_name,
                spt.name AS syarat_pembayaran_name
            FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt 
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = fpbt.tipe_pembayaran
            JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
            WHERE fpbt.pesanan_penjualan_barang = "${pesanan_penjualan_barang}"
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

export const checkPengirimanBarangFakturPenjualanBarangRepo = async (uuid, req_id) => {
    return await db.query(`
            SELECT 
                pbt.nomor_surat_jalan 
            FROM ${generateDatabaseName(req_id)}.pengiriman_barang_tab pbt 
            WHERE pbt.faktur_penjualan_barang = "${uuid}"
            AND pbt.enabled = 1
            LIMIT 1
        `, {
        type: Sequelize.QueryTypes.SELECT
    })
}