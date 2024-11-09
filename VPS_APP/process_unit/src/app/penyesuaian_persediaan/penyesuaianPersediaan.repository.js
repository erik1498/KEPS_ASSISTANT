import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PenyesuaianPersediaanModel from "./penyesuaianPersediaan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPenyesuaianPersediaanRepo = async (pageNumber, size, search, req_id) => {
    const penyesuaianPersediaansCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : penyesuaianPersediaansCount[0].count

    const penyesuaianPersediaans = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: penyesuaianPersediaans,
        count: penyesuaianPersediaansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPenyesuaianPersediaanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PenyesuaianPersediaanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getPenyesuaianPersediaanByPerintahStokOpnameRepo = async (perintah_stok_opname, req_id) => {
    return await db.query(
        `
            SELECT 
                res.jumlah_awal_stok_fix - res.penjualan + res.retur_penjualan + res.pembelian - res.retur_pembelian - res.konversi_keluar + res.konversi_masuk + res.transfer_masuk - res.transfer_keluar AS stok_sistem,
                CASE 
                    WHEN (res.jumlah_awal_stok_fix - res.penjualan + res.retur_penjualan + res.pembelian - res.retur_pembelian) > res.kuantitas
                    THEN "PENGURANGAN"
                    ELSE 
                        CASE
                            WHEN (res.jumlah_awal_stok_fix - res.penjualan + res.retur_penjualan + res.pembelian - res.retur_pembelian) = res.kuantitas
                            THEN "SESUAI"
                            ELSE "PENAMBAHAN"
                        END
                END AS tipe_penyesuaian,
                res.*
            FROM (
                SELECT 
                    CASE 
                        WHEN res.sudah_divalidasi_bulan_sebelum != "KOSONG"
                        THEN IFNULL((
                            SELECT 
                                hsot.kuantitas 
                            FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot 
                            WHERE hsot.perintah_stok_opname = res.sudah_divalidasi_bulan_sebelum
                            AND hsot.enabled = 1
                            AND hsot.stok_awal_barang = res.stok_awal_barang
                        ), 0)
                        ELSE res.jumlah_awal_stok
                    END AS jumlah_awal_stok_fix,
                    res.*
                FROM (
                    SELECT 
                        IFNULL((
                            SELECT 
                                ppt.uuid
                            FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                            WHERE ppt.hasil_stok_opname = hsot.uuid
                            AND ppt.enabled = 1
                        ), "") AS uuid,
                        IFNULL((
                            SELECT 
                                ppt.keterangan 
                            FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                            WHERE ppt.hasil_stok_opname = hsot.uuid
                            AND ppt.enabled = 1
                        ), "") AS keterangan,
                        IFNULL((
                            SELECT 
                                ppt.tanggal 
                            FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
                            WHERE ppt.hasil_stok_opname = hsot.uuid
                            AND ppt.enabled = 1
                        ), "") AS tanggal,
                        IFNULL((
                            SELECT
                                SUM(rkbt.jumlah_yang_dikonversi)
                            FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rkbt
                            JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab kbt ON kbt.uuid = rkbt.konversi_barang 
                            WHERE rkbt.stok_awal_barang = sabt.uuid 
                            AND rkbt.enabled = 1
                            AND kbt.enabled = 1
                        ), 0) AS konversi_keluar,
                        IFNULL((
                            SELECT 
                                SUM(rtbt.jumlah) 
                            FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab rtbt 
                            JOIN ${generateDatabaseName(req_id)}.transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
                            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt2 ON sabt2.uuid = rtbt.stok_awal_barang 
                            WHERE tbt.enabled = 1
                            AND sabt2.daftar_gudang = tbt.daftar_gudang_asal 
                            AND rtbt.stok_awal_barang_tujuan = sabt.uuid
                        ), 0) AS transfer_masuk,
                        IFNULL((
                            SELECT 
                                SUM(rtbt.jumlah) 
                            FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab rtbt 
                            JOIN ${generateDatabaseName(req_id)}.transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
                            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt2 ON sabt2.uuid = rtbt.stok_awal_barang 
                            WHERE tbt.enabled = 1
                            AND sabt2.daftar_gudang = tbt.daftar_gudang_asal 
                            AND rtbt.stok_awal_barang = sabt.uuid
                        ), 0) AS transfer_keluar,
                        IFNULL((
                            SELECT
                                SUM(rkbt.jumlah_hasil_konversi_kode_barang_tujuan)
                            FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rkbt
                            JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab kbt ON kbt.uuid = rkbt.konversi_barang 
                            WHERE rkbt.stok_awal_barang_tujuan = sabt.uuid 
                            AND rkbt.enabled = 1
                            AND kbt.enabled = 1
                        ), 0) AS konversi_masuk,
                        IFNULL((
                            SELECT
                                SUM(rppbt.jumlah) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
                            WHERE rppbt.stok_awal_barang = sabt.uuid 
                            AND ppbt.enabled = 1 
                            AND rppbt.enabled = 1
                        ), 0) AS pembelian,
                        IFNULL((
                            SELECT 
                                SUM(rrpbt.jumlah) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_pembelian_barang
                            WHERE rppbt.stok_awal_barang = sabt.uuid 
                            AND rrpbt.enabled = 1
                            AND rppbt.enabled = 1
                        ), 0) AS retur_pembelian,
                        IFNULL((
                            SELECT
                                SUM(rppbt.jumlah) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
                            WHERE rppbt.stok_awal_barang = sabt.uuid 
                            AND ppbt.enabled = 1 
                            AND rppbt.enabled = 1
                        ), 0) AS penjualan,
                        IFNULL((
                            SELECT 
                                SUM(rrpbt.retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rrpbt.rincian_pesanan_penjualan_barang
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang
                            WHERE rppbt.stok_awal_barang = sabt.uuid 
                            AND rrpbt.enabled = 1
                            AND rppbt.enabled = 1
                            AND rpbt.enabled = 1
                        ), 0) AS retur_penjualan,
                        IFNULL((
                            SELECT
                                psot2.uuid
                            FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot2 
                            WHERE psot2.enabled = 1
                            AND psot2.validasi = 1
                            AND psot2.kategori_barang = psot.kategori_barang 
                            AND psot2.gudang_asal = psot.gudang_asal
                            AND psot2.bulan_transaksi = psot.bulan_transaksi - 1 
                            AND psot2.tahun = psot.tahun 
                            LIMIT 1
                        ), "KOSONG") AS sudah_divalidasi_bulan_sebelum,
                        hsot.uuid AS hasil_stok_opname,
                        hsot.kuantitas AS kuantitas,
                        sabt.jumlah AS jumlah_awal_stok,
                        sabt.uuid AS stok_awal_barang,
                        kht.kode_barang AS kategori_harga_barang_kode_barang,
                        dbt.name AS daftar_barang_name,
                        sbt.name AS satuan_barang_name
                    FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot 
                    JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = hsot.stok_awal_barang 
                    JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang
                    JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab kht ON kht.uuid = sabt.kategori_harga_barang
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = kht.satuan_barang 
                    JOIN ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot ON psot.uuid = hsot.perintah_stok_opname
                    WHERE hsot.perintah_stok_opname = "${perintah_stok_opname}"
                    AND hsot.enabled = 1
                ) AS res
            ) AS res
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createPenyesuaianPersediaanRepo = async (penyesuaianPersediaanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenyesuaianPersediaanModel,
        {
            tanggal: penyesuaianPersediaanData.tanggal,
            perintah_stok_opname: penyesuaianPersediaanData.perintah_stok_opname,
            hasil_stok_opname: penyesuaianPersediaanData.hasil_stok_opname,
            kuantitas: penyesuaianPersediaanData.kuantitas,
            stok_tersedia_sistem: penyesuaianPersediaanData.stok_tersedia_sistem,
            tipe_penyesuaian: penyesuaianPersediaanData.tipe_penyesuaian,
            jumlah: penyesuaianPersediaanData.jumlah,
            keterangan: penyesuaianPersediaanData.keterangan,
            enabled: penyesuaianPersediaanData.enabled
        }
    )
}

export const deletePenyesuaianPersediaanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenyesuaianPersediaanModel,
        {
            enabled: false
        },
        {
            perintah_stok_opname: uuid
        }
    )
}

export const updatePenyesuaianPersediaanByUuidRepo = async (uuid, penyesuaianPersediaanData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenyesuaianPersediaanModel,
        {
            tanggal: penyesuaianPersediaanData.tanggal,
            perintah_stok_opname: penyesuaianPersediaanData.perintah_stok_opname,
            hasil_stok_opname: penyesuaianPersediaanData.hasil_stok_opname,
            kuantitas: penyesuaianPersediaanData.kuantitas,
            stok_tersedia_sistem: penyesuaianPersediaanData.stok_tersedia_sistem,
            tipe_penyesuaian: penyesuaianPersediaanData.tipe_penyesuaian,
            jumlah: penyesuaianPersediaanData.jumlah,
            keterangan: penyesuaianPersediaanData.keterangan,
        },
        {
            uuid
        }
    )
}