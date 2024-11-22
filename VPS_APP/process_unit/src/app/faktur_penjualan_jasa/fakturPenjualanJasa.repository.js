import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import FakturPenjualanJasaModel from "./fakturPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllFakturPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const fakturPenjualanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab WHERE pesanan_penjualan_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : fakturPenjualanJasasCount[0].count

    const fakturPenjualanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab WHERE pesanan_penjualan_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: fakturPenjualanJasas,
        count: fakturPenjualanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDRepo = async (faktur_penjualan_jasa_uuid, req_id) => {
    return await db.query(
        `
            SELECT
                res.*
            FROM (
                SELECT 
                    ppbt.uuid AS uuid,
                    ppbt.faktur_penjualan_jasa AS faktur_penjualan_jasa,
                    ppbt.tanggal AS tanggal ,
                    ppbt.bukti_transaksi AS bukti_transaksi,
                    ppbt.nomor_pelunasan_penjualan_jasa AS nomor_transaksi,
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
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppbt
                        WHERE rppbt.pelunasan_penjualan_jasa = ppbt.uuid
                        AND rppbt.enabled = 1
                    ), 0) 
                    + 
                    IFNULL((
                        SELECT 
                            SUM(rppdbt.nilai_pelunasan)
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_jasa_tab rppdbt
                        WHERE rppdbt.pelunasan_penjualan_jasa = ppbt.uuid
                        AND rppdbt.enabled = 1
                    ), 0) AS total,
                    "pelunasan_penjualan_jasa" AS type
                FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppbt.kode_akun_perkiraan 
                WHERE ppbt.faktur_penjualan_jasa = "${faktur_penjualan_jasa_uuid}"
                AND ppbt.enabled = 1
                UNION ALL
                SELECT 
                    rpbt.uuid AS uuid,
                    rpbt.faktur_penjualan_jasa AS faktur_penjualan_jasa,
                    rpbt.tanggal AS tanggal ,
                    rpbt.bukti_transaksi AS bukti_transaksi,
                    rpbt.nomor_retur_penjualan_jasa AS nomor_transaksi,
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
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt
                        WHERE rrpbt.retur_penjualan_jasa = rpbt.uuid
                        AND rrpbt.enabled = 1
                    ), 0)AS total,
                    "retur_penjualan_jasa" AS type
                FROM ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rpbt.kode_akun_perkiraan 
                WHERE rpbt.faktur_penjualan_jasa = "${faktur_penjualan_jasa_uuid}"
                AND rpbt.enabled = 1
                UNION ALL
                SELECT 
                    pdpbt.uuid AS uuid,
                    pdpbt.faktur_penjualan_jasa AS faktur_penjualan_jasa,
                    pdpbt.tanggal AS tanggal,
                    pdpbt.bukti_transaksi AS bukti_transaksi,
                    pdpbt.nomor_pengembalian_denda_penjualan_jasa AS nomor_transaksi,
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
                    "pengembalian_denda_penjualan_jasa" AS type
                FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpbt 
                JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pdpbt.kode_akun_perkiraan 
                WHERE pdpbt.faktur_penjualan_jasa = "${faktur_penjualan_jasa_uuid}"
                AND pdpbt.enabled = 1
            ) AS res
            ORDER BY res.tanggal DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getFakturPenjualanJasaByPesananPenjualanJasaUUIDRepo = async (pesanan_penjualan_jasa_uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                fpbt.*, 
                tpt.name AS tipe_pembayaran_name,
                spt.name AS syarat_pembayaran_name
            FROM ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt 
            JOIN ${generateDatabaseName(req_id)}.tipe_pembayaran_tab tpt ON tpt.uuid = fpbt.tipe_pembayaran
            JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
            WHERE fpbt.pesanan_penjualan_jasa = "${pesanan_penjualan_jasa_uuid}"
            AND fpbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getFakturPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        FakturPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createFakturPenjualanJasaRepo = async (fakturPenjualanJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanJasaModel,
        {
            pesanan_penjualan_jasa: fakturPenjualanJasaData.pesanan_penjualan_jasa,
            tanggal: fakturPenjualanJasaData.tanggal,
            nomor_faktur_penjualan_jasa: fakturPenjualanJasaData.nomor_faktur_penjualan_jasa,
            bukti_transaksi: fakturPenjualanJasaData.bukti_transaksi,
            tipe_pembayaran: fakturPenjualanJasaData.tipe_pembayaran,
            syarat_pembayaran: fakturPenjualanJasaData.syarat_pembayaran,
            keterangan: fakturPenjualanJasaData.keterangan,
            nomor_faktur_pajak_penjualan_jasa: fakturPenjualanJasaData.nomor_faktur_pajak_penjualan_jasa,
            enabled: fakturPenjualanJasaData.enabled
        }
    )
}

export const deleteFakturPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateFakturPenjualanJasaByUuidRepo = async (uuid, fakturPenjualanJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        FakturPenjualanJasaModel,
        {
            pesanan_penjualan_jasa: fakturPenjualanJasaData.pesanan_penjualan_jasa,
            tanggal: fakturPenjualanJasaData.tanggal,
            nomor_faktur_penjualan_jasa: fakturPenjualanJasaData.nomor_faktur_penjualan_jasa,
            bukti_transaksi: fakturPenjualanJasaData.bukti_transaksi,
            tipe_pembayaran: fakturPenjualanJasaData.tipe_pembayaran,
            syarat_pembayaran: fakturPenjualanJasaData.syarat_pembayaran,
            keterangan: fakturPenjualanJasaData.keterangan,
            nomor_faktur_pajak_penjualan_jasa: fakturPenjualanJasaData.nomor_faktur_pajak_penjualan_jasa,
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
                        "pelunasan_penjualan_jasa"
                    FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppt WHERE ppt.tanggal = res.tanggal_valid
                    AND ppt.enabled = 1
                    UNION ALL 
                    SELECT 
                        "retur_penjualan_jasa"
                    FROM ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpt WHERE rpt.tanggal = res.tanggal_valid
                    AND rpt.enabled = 1
                    UNION ALL 
                    SELECT 
                        "pengembalian_denda_penjualan_jasa"
                    FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpt WHERE pdpt.tanggal = res.tanggal_valid
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
                                SELECT MAX(ppbt2.tanggal) FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 WHERE ppbt2.faktur_penjualan_jasa = fpbt.uuid 
                                AND ppbt2.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(rpt.tanggal) FROM ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpt WHERE rpt.faktur_penjualan_jasa = fpbt.uuid 
                                AND rpt.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(pdpt.tanggal) FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpt WHERE pdpt.faktur_penjualan_jasa = fpbt.uuid
                                AND pdpt.enabled = 1
                            ), fpbt.tanggal) 
                        ) AS tanggal_terakhir_transaksi,
                        GREATEST(
                            fpbt.tanggal,
                            IFNULL((
                                SELECT MAX(ppbt2.tanggal) FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 WHERE ppbt2.faktur_penjualan_jasa = fpbt.uuid AND ppbt2.tanggal >= "${tanggal_baru}" AND ppbt2.tanggal < "${tanggal_lama}"
                                AND ppbt2.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(rpt.tanggal) FROM ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpt WHERE rpt.faktur_penjualan_jasa = fpbt.uuid AND rpt.tanggal >= "${tanggal_baru}" AND rpt.tanggal < "${tanggal_lama}"
                                AND rpt.enabled = 1
                            ), fpbt.tanggal),
                            IFNULL((
                                SELECT MAX(pdpt.tanggal) FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpt WHERE pdpt.faktur_penjualan_jasa = fpbt.uuid AND pdpt.tanggal >= "${tanggal_baru}" AND pdpt.tanggal < "${tanggal_lama}"
                                AND pdpt.enabled = 1
                            ), fpbt.tanggal) 
                        ) AS tanggal_terakhir_transaksi_lewati_tanggal_baru
                    FROM ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppt ON ppt.uuid = fpbt.pesanan_penjualan_jasa 
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
                    WHERE ppt.faktur_penjualan_jasa = ppt.faktur_penjualan_jasa 
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
                    FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_jasa_tab rppt 
                    WHERE rppt.${table_name} = ppt.uuid 
                    AND ppt.enabled = 1
                    AND rppt.enabled = 1
                ) AS rincian_denda_count,
                (
                    SELECT 
                        COUNT(0) 
                    FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt 
                    WHERE ppt.faktur_penjualan_jasa = ppt.faktur_penjualan_jasa 
                    AND ppt.enabled = 1
                ) AS ${table_name}_denda_count
            FROM ${generateDatabaseName(req_id)}.${table_name}_tab ppt WHERE ppt.tanggal = "${tanggal}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return fakturPenjualans
}