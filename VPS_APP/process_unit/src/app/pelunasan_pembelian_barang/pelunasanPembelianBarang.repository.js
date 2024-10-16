import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PelunasanPembelianBarangModel from "./pelunasanPembelianBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPelunasanPembelianBarangRepo = async (pageNumber, size, search, req_id) => {
    const pelunasanPembelianBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab WHERE faktur_pembelian_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pelunasanPembelianBarangsCount[0].count

    const pelunasanPembelianBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab WHERE faktur_pembelian_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pelunasanPembelianBarangs,
        count: pelunasanPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getCekDendaByPelunasanPembelianUUIDRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                CASE 
                    WHEN SUM(res.pelunasan_sudah_dibayar) = SUM(res.total)
                    THEN 0
                    ELSE (
                        CASE
                            WHEN SUM(
                                CASE 
                                    WHEN ((res.total * res.syarat_pembelian_denda) / 100) * res.hari_terlewat_pembayaran_terakhir = res.denda_sudah_dibayar
                                    THEN 
                                        CASE
                                            WHEN res.perbedaan_hari_bayar_denda_terakhir = 0
                                            THEN 0
                                            ELSE ((res.total * res.syarat_pembelian_denda) / 100) * res.hari_terlewat
                                        END
                                    ELSE ((res.total * res.syarat_pembelian_denda) / 100) * res.hari_terlewat
                                END
                            ) > 0
                            THEN 1
                            ELSE 0
                        END
                    )
                END AS denda
            FROM (
                SELECT
                    res.*,
                    CASE
                        WHEN (res.harga_setelah_diskon * (res.jumlah - res.retur)) + (res.ppn_setelah_diskon *  (res.jumlah - res.retur)) - res.diskon_angka > 0
                        THEN (res.harga_setelah_diskon * (res.jumlah - res.retur)) + (res.ppn_setelah_diskon *  (res.jumlah - res.retur)) - res.diskon_angka
                        ELSE 0
                    END
                    AS total
                FROM (
                    SELECT 
                    (
                        DATEDIFF(
                            ( 
                                SELECT 
                                    ppbt2.tanggal 
                                FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 
                                WHERE ppbt2.uuid = "${uuid}"
                            ),
                            ( ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ) )
                        )
                    ) AS hari_terlewat,
                    (
                        SELECT 
                            IFNULL(SUM(rppdbt.nilai_pelunasan), 0) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_denda_barang_tab rppdbt
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_pembelian_barang
                        WHERE rppdbt.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND ppbt.tanggal < (
                            SELECT 
                                ppbt2.tanggal 
                            FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 
                            WHERE ppbt2.uuid = "${uuid}"
                        )
                        AND rppdbt.enabled = 1
                        AND ppbt.enabled = 1
                    ) AS denda_sudah_dibayar,
                    (
                        SELECT 
                            DATEDIFF(MAX(ppbt.tanggal), (
                            SELECT 
                                ppbt2.tanggal 
                            FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 
                            WHERE ppbt2.uuid = "${uuid}"
                        )) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_denda_barang_tab rppdbt
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_pembelian_barang
                        WHERE rppdbt.enabled = 1 
                        AND ppbt.enabled = 1
                    ) AS perbedaan_hari_bayar_denda_terakhir,
                    (
                        DATEDIFF(
                            (
                                SELECT 
                                    MAX(ppbt3.tanggal)
                                FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_denda_barang_tab rppdbt2
                                JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt3 ON ppbt3.uuid = rppdbt2.pelunasan_pembelian_barang 
                                WHERE rppdbt2.rincian_pesanan_pembelian_barang = rppbt.uuid
                                AND rppdbt2.enabled = 1
                                AND ppbt3.enabled = 1
                            ),
                            ( ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ) )
                        )
                    ) AS hari_terlewat_pembayaran_terakhir,
                    IFNULL((
                        SELECT SUM(rrpbt.retur) FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_pembelian_barang
                        WHERE rrpbt.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND rrpbt.enabled = 1
                        AND rpbt2.enabled = 1
                        AND rpbt2.tanggal < (
                            SELECT 
                                ppbt2.tanggal 
                            FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 
                            WHERE ppbt2.uuid = "${uuid}"
                        )
                    ), 0) AS retur,
                    IFNULL((
                        SELECT SUM(rppbt2.nilai_pelunasan) FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_barang_tab rppbt2 
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt2.pelunasan_pembelian_barang
                        WHERE rppbt2.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND ppbt.tanggal < (
                            SELECT 
                                ppbt2.tanggal 
                            FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 
                            WHERE ppbt2.uuid = "${uuid}"
                        )
                        AND rppbt2.enabled = 1
                        AND ppbt.enabled = 1
                    ), 0) AS pelunasan_sudah_dibayar,
                    spt.denda AS syarat_pembelian_denda,
                    rppbt.*
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
                    JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
                    JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran 
                    WHERE fpbt.uuid = (
                            SELECT 
                                ppbt2.faktur_pembelian_barang 
                            FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 
                            WHERE ppbt2.uuid = "${uuid}"
                        )
                    AND rppbt.enabled = 1
                    AND ppbt.enabled = 1
                ) AS res
            ) AS res
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getPelunasanPembelianBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PelunasanPembelianBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPelunasanPembelianBarangRepo = async (pelunasanPembelianBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PelunasanPembelianBarangModel,
        {
            faktur_pembelian_barang: pelunasanPembelianBarangData.faktur_pembelian_barang,
            tanggal: pelunasanPembelianBarangData.tanggal,
            bukti_transaksi: pelunasanPembelianBarangData.bukti_transaksi,
            nomor_pelunasan_pembelian_barang: pelunasanPembelianBarangData.nomor_pelunasan_pembelian_barang,
            kode_akun_perkiraan: pelunasanPembelianBarangData.kode_akun_perkiraan,
            keterangan: pelunasanPembelianBarangData.keterangan,
            enabled: pelunasanPembelianBarangData.enabled
        }
    )
}

export const deletePelunasanPembelianBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PelunasanPembelianBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePelunasanPembelianBarangByUuidRepo = async (uuid, pelunasanPembelianBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PelunasanPembelianBarangModel,
        {
            faktur_pembelian_barang: pelunasanPembelianBarangData.faktur_pembelian_barang,
            tanggal: pelunasanPembelianBarangData.tanggal,
            bukti_transaksi: pelunasanPembelianBarangData.bukti_transaksi,
            nomor_pelunasan_pembelian_barang: pelunasanPembelianBarangData.nomor_pelunasan_pembelian_barang,
            kode_akun_perkiraan: pelunasanPembelianBarangData.kode_akun_perkiraan,
            keterangan: pelunasanPembelianBarangData.keterangan,
        },
        {
            uuid
        }
    )
}