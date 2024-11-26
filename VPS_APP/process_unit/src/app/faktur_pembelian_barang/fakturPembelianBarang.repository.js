import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import FakturPembelianBarangModel from "./fakturPembelianBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllFakturPembelianBarangRepo = async (pageNumber, size, search, req_id) => {
    const fakturPembelianBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab WHERE pesanan_pembelian_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : fakturPembelianBarangsCount[0].count

    const fakturPembelianBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab WHERE pesanan_pembelian_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: fakturPembelianBarangs,
        count: fakturPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getFakturReportPembelianBarangsRepo = async (pageNumber, size, search, req_id) => {
    const fakturPembelianBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM (
                SELECT 
                    IFNULL((
                        SELECT 
                            SUM(rppbt.total_harga)
                        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                        WHERE rppbt.enabled = 1
                        AND rppbt.pesanan_pembelian_barang = fpbt.pesanan_pembelian_barang
                    ), 0) AS total_beli,
                    IFNULL((
                        SELECT 
                            rrpbt.nilai_retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_pembelian_barang 
                        WHERE rrpbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND rpbt.faktur_pembelian_barang = fpbt.uuid 
                        ORDER BY rpbt.tanggal DESC 
                        LIMIT 1
                    ), 0) AS total_retur, 
                    IFNULL((
                        SELECT 
                            rppbt.sudah_dibayar 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_barang_tab rppbt
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 ON ppbt2.uuid = rppbt.pelunasan_pembelian_barang 
                        WHERE rppbt.enabled = 1
                        AND ppbt2.enabled = 1
                        AND ppbt2.faktur_pembelian_barang = fpbt.uuid 
                        ORDER BY ppbt2.tanggal DESC
                        LIMIT 1
                    ), 0) AS total_pelunasan,
                    fpbt.tanggal,
                    fpbt.nomor_faktur_pembelian_barang,
                    fpbt.bukti_transaksi AS bukti_transaksi_faktur,
                    ppbt.nomor_pesanan_pembelian_barang,
                    st.name AS supplier_name,
                    st.code AS supplier_code
                FROM ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = fpbt.pesanan_pembelian_barang 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
            ) AS res
            WHERE CONCAT(
                res.nomor_faktur_pembelian_barang,
                res.bukti_transaksi_faktur,
                res.nomor_pesanan_pembelian_barang,
                res.supplier_name,
                res.supplier_code
            ) 
            LIKE '%${search}%' 
            ORDER BY res.tanggal DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : fakturPembelianBarangsCount[0].count

    const fakturPembelianBarangs = await db.query(
        `
            SELECT 
                res.total_beli - (res.total_pelunasan - res.total_retur) AS piutang,
                res.*
            FROM (
                SELECT 
                    IFNULL((
                        SELECT 
                            SUM(rppbt.total_harga)
                        FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                        WHERE rppbt.enabled = 1
                        AND rppbt.pesanan_pembelian_barang = fpbt.pesanan_pembelian_barang
                    ), 0) AS total_beli,
                    IFNULL((
                        SELECT 
                            rrpbt.nilai_retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_pembelian_barang 
                        WHERE rrpbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND rpbt.faktur_pembelian_barang = fpbt.uuid 
                        ORDER BY rpbt.tanggal DESC 
                        LIMIT 1
                    ), 0) AS total_retur, 
                    IFNULL((
                        SELECT 
                            rppbt.sudah_dibayar 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_barang_tab rppbt
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 ON ppbt2.uuid = rppbt.pelunasan_pembelian_barang 
                        WHERE rppbt.enabled = 1
                        AND ppbt2.enabled = 1
                        AND ppbt2.faktur_pembelian_barang = fpbt.uuid 
                        ORDER BY ppbt2.tanggal DESC
                        LIMIT 1
                    ), 0) AS total_pelunasan,
                    fpbt.tanggal,
                    fpbt.nomor_faktur_pembelian_barang,
                    fpbt.bukti_transaksi AS bukti_transaksi_faktur,
                    ppbt.nomor_pesanan_pembelian_barang,
                    st.name AS supplier_name,
                    st.code AS supplier_code
                FROM ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = fpbt.pesanan_pembelian_barang 
                JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
                WHERE fpbt.enabled = 1
                AND ppbt.enabled = 1
            ) AS res
            WHERE CONCAT(
                res.nomor_faktur_pembelian_barang,
                res.bukti_transaksi_faktur,
                res.nomor_pesanan_pembelian_barang,
                res.supplier_name,
                res.supplier_code
            ) 
            LIKE '%${search}%'
            ORDER BY res.tanggal DESC
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: fakturPembelianBarangs,
        count: fakturPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUIDRepo = async (faktur_pembelian_barang_uuid, req_id) => {
    return await db.query(
        `
            SELECT
                res.*
            FROM (
                SELECT 
                    ppbt.uuid AS uuid,
                    ppbt.faktur_pembelian_barang AS faktur_pembelian_barang,
                    ppbt.tanggal AS tanggal ,
                    ppbt.bukti_transaksi AS bukti_transaksi,
                    ppbt.nomor_pelunasan_pembelian_barang AS nomor_transaksi,
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
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_barang_tab rppbt
                        WHERE rppbt.pelunasan_pembelian_barang = ppbt.uuid
                        AND rppbt.enabled = 1
                    ), 0) 
                    + 
                    IFNULL((
                        SELECT 
                            SUM(rppdbt.nilai_pelunasan)
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_denda_barang_tab rppdbt
                        WHERE rppdbt.pelunasan_pembelian_barang = ppbt.uuid
                        AND rppdbt.enabled = 1
                    ), 0) AS total,
                    "pelunasan_pembelian_barang" AS type
                FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppbt.kode_akun_perkiraan 
                WHERE ppbt.faktur_pembelian_barang = "${faktur_pembelian_barang_uuid}"
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.uuid AS uuid,
                    rpbt.faktur_pembelian_barang AS faktur_pembelian_barang,
                    rpbt.tanggal AS tanggal ,
                    rpbt.bukti_transaksi AS bukti_transaksi,
                    rpbt.nomor_retur_pembelian_barang AS nomor_transaksi,
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
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt
                        WHERE rrpbt.retur_pembelian_barang = rpbt.uuid
                        AND rrpbt.enabled = 1
                    ), 0)AS total,
                    "retur_pembelian_barang" AS type
                FROM ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rpbt.kode_akun_perkiraan 
                WHERE rpbt.faktur_pembelian_barang = "${faktur_pembelian_barang_uuid}"
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.uuid AS uuid,
                    pdpbt.faktur_pembelian_barang AS faktur_pembelian_barang,
                    pdpbt.tanggal AS tanggal,
                    pdpbt.bukti_transaksi AS bukti_transaksi,
                    pdpbt.nomor_pengembalian_denda_pembelian_barang AS nomor_transaksi,
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
                    "pengembalian_denda_pembelian_barang" AS type
                FROM ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pdpbt.kode_akun_perkiraan 
                WHERE pdpbt.faktur_pembelian_barang = "${faktur_pembelian_barang_uuid}"
                AND pdpbt.enabled = 1
            ) AS res
            ORDER BY res.tanggal DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getFakturPembelianBarangByPesananPembelianBarangUUIDRepo = async (pesanan_pembelian_barang, req_id) => {
    return await db.query(
        `
            SELECT 
                fpbt.*, 
                tpt.name AS tipe_pembayaran_name
            FROM ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt 
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = fpbt.tipe_pembayaran
            WHERE fpbt.pesanan_pembelian_barang = "${pesanan_pembelian_barang}"
            AND fpbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getFakturPembelianBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        FakturPembelianBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createFakturPembelianBarangRepo = async (fakturPembelianBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPembelianBarangModel,
        {
            pesanan_pembelian_barang: fakturPembelianBarangData.pesanan_pembelian_barang,
            tanggal: fakturPembelianBarangData.tanggal,
            nomor_faktur_pembelian_barang: fakturPembelianBarangData.nomor_faktur_pembelian_barang,
            bukti_transaksi: fakturPembelianBarangData.bukti_transaksi,
            tipe_pembayaran: fakturPembelianBarangData.tipe_pembayaran,
            syarat_pembayaran: fakturPembelianBarangData.syarat_pembayaran,
            keterangan: fakturPembelianBarangData.keterangan,
            nomor_faktur_pajak_pembelian_barang: fakturPembelianBarangData.nomor_faktur_pajak_pembelian_barang,
            enabled: fakturPembelianBarangData.enabled
        }
    )
}

export const deleteFakturPembelianBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPembelianBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateFakturPembelianBarangByUuidRepo = async (uuid, fakturPembelianBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPembelianBarangModel,
        {
            pesanan_pembelian_barang: fakturPembelianBarangData.pesanan_pembelian_barang,
            tanggal: fakturPembelianBarangData.tanggal,
            nomor_faktur_pembelian_barang: fakturPembelianBarangData.nomor_faktur_pembelian_barang,
            bukti_transaksi: fakturPembelianBarangData.bukti_transaksi,
            tipe_pembayaran: fakturPembelianBarangData.tipe_pembayaran,
            syarat_pembayaran: fakturPembelianBarangData.syarat_pembayaran,
            keterangan: fakturPembelianBarangData.keterangan,
            nomor_faktur_pajak_pembelian_barang: fakturPembelianBarangData.nomor_faktur_pajak_pembelian_barang,
        },
        {
            uuid
        }
    )
}

export const getTanggalTransaksiTerakhirByFakturPembelianRepo = async (faktur_pembelian, tanggal_lama, tanggal_baru, req_id) => {
    const fakturPembelians = await db.query(
        `
            SELECT 
                res.*,
                (
                    SELECT 
                        "pelunasan_pembelian_barang"
                    FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppt WHERE ppt.tanggal = res.tanggal_valid
                    AND ppt.enabled = 1
                    UNION ALL 
                    SELECT 
                        "retur_pembelian_barang"
                    FROM ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpt WHERE rpt.tanggal = res.tanggal_valid
                    AND rpt.enabled = 1
                    UNION ALL 
                    SELECT 
                        "pengembalian_denda_pembelian_barang"
                    FROM ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpt WHERE pdpt.tanggal = res.tanggal_valid
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
                                SELECT MAX(ppbt2.tanggal) FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 WHERE ppbt2.faktur_pembelian_barang = fpbt.uuid 
                                AND ppbt2.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(rpt.tanggal) FROM ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpt WHERE rpt.faktur_pembelian_barang = fpbt.uuid 
                                AND rpt.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(pdpt.tanggal) FROM ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpt WHERE pdpt.faktur_pembelian_barang = fpbt.uuid
                                AND pdpt.enabled = 1
                            ), fpbt.tanggal) 
                        ) AS tanggal_terakhir_transaksi,
                        GREATEST(
                            fpbt.tanggal,
                            IFNULL((
                                SELECT MAX(ppbt2.tanggal) FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 WHERE ppbt2.faktur_pembelian_barang = fpbt.uuid AND ppbt2.tanggal >= "${tanggal_baru}" AND ppbt2.tanggal < "${tanggal_lama}"
                                AND ppbt2.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(rpt.tanggal) FROM ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpt WHERE rpt.faktur_pembelian_barang = fpbt.uuid AND rpt.tanggal >= "${tanggal_baru}" AND rpt.tanggal < "${tanggal_lama}"
                                AND rpt.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(pdpt.tanggal) FROM ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpt WHERE pdpt.faktur_pembelian_barang = fpbt.uuid AND pdpt.tanggal >= "${tanggal_baru}" AND pdpt.tanggal < "${tanggal_lama}"
                                AND pdpt.enabled = 1
                            ), fpbt.tanggal) 
                        ) AS tanggal_terakhir_transaksi_lewati_tanggal_baru
                    FROM ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt
                    JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppt ON ppt.uuid = fpbt.pesanan_pembelian_barang 
                    WHERE fpbt.uuid = "${faktur_pembelian}"
                ) AS res
            ) AS res
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return fakturPembelians
}

export const getJumlahRincianTransaksiOnTableByTanggalRepo = async (table_name, tanggal, req_id) => {
    const fakturPembelians = await db.query(
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
                    WHERE ppt.faktur_pembelian_barang = ppt.faktur_pembelian_barang 
                    AND ppt.enabled = 1
                ) AS ${table_name}_count
            FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt WHERE ppt.tanggal = "${tanggal}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return fakturPembelians
}


export const getJumlahRincianTransaksiDendaOnTableByTanggalRepo = async (table_name, tanggal, req_id) => {
    const fakturPembelians = await db.query(
        `
            SELECT 
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_denda_barang_tab rppt 
                    WHERE rppt.${table_name} = ppt.uuid 
                    AND ppt.enabled = 1
                    AND rppt.enabled = 1
                ) AS rincian_denda_count,
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt 
                    WHERE ppt.faktur_pembelian_barang = ppt.faktur_pembelian_barang 
                    AND ppt.enabled = 1
                ) AS ${table_name}_denda_count
            FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt WHERE ppt.tanggal = "${tanggal}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return fakturPembelians
}