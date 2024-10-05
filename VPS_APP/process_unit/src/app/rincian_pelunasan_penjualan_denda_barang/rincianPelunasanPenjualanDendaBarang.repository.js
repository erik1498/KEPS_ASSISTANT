import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPelunasanPenjualanDendaBarangModel from "./rincianPelunasanPenjualanDendaBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPelunasanPenjualanDendaBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianPelunasanPenjualanDendaBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab WHERE pelunasan_penjualan LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPelunasanPenjualanDendaBarangsCount[0].count

    const rincianPelunasanPenjualanDendaBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab WHERE pelunasan_penjualan LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPelunasanPenjualanDendaBarangs,
        count: rincianPelunasanPenjualanDendaBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                res.*,
                CASE 
                    WHEN res.total_denda > 0 
                    THEN res.total_denda        
                    ELSE res.denda_sudah_dibayar
                END AS total_denda
            FROM (
                SELECT 
                    res.*,
                    CASE 
                        WHEN res.sudah_dibayar < (res.total - res.diskon_angka)
                        THEN res.hari_terlewat * (
                            (res.syarat_pembayaran_denda * (((res.jumlah - res.retur) * res.harga_setelah_diskon) + ((res.jumlah - res.retur) * res.ppn_setelah_diskon) - res.diskon_angka)) / 100
                        )
                        ELSE 0
                    END AS total_denda
                FROM (
                    SELECT
                        rppbt.id, 
                        rppbt.uuid, 
                        khbt.kode_barang AS kategori_harga_barang_kode_barang,
                        dbt.name AS daftar_barang_name,
                        sbt.name AS satuan_barang_name,
                        jbt.code AS jenis_barang_code,
                        rppbt.harga,
                        rppbt.harga_setelah_diskon,
                        rppbt.ppn,
                        rppbt.ppn_setelah_diskon,
                        rppbt.jumlah,
                        (rppbt.harga_setelah_diskon * rppbt.jumlah) + (rppbt.ppn_setelah_diskon * rppbt.jumlah) AS total,
                        rppbt.diskon_angka,
                        rppbt.diskon_persentase,
                        IFNULL((
                            SELECT 
                                SUM(rppbt2.nilai_pelunasan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt2
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_barang
                            WHERE rppbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND ppbt2.tanggal < (
                                SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                            ) 
                            AND rppbt2.enabled = 1
                            AND ppbt2.enabled = 1
                        ), 0) AS sudah_dibayar,
                        IFNULL((
                            SELECT 
                                SUM(rppdbt.nilai_pelunasan)
                                - IFNULL((
                                    SELECT 
                                        SUM(rpdpbt.denda_yang_dikembalikan) 
                                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
                                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_barang
                                    WHERE rpdpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                                    AND pdpbt.enabled = 1
                                    AND rpdpbt.enabled = 1
                                ), 0) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_penjualan_barang
                            WHERE rppdbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND ppbt.tanggal < (
                                SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                            )
                            AND rppdbt.enabled = 1
                            AND ppbt.enabled = 1
                        ), 0) AS denda_sudah_dibayar, 
                        (
                            DATEDIFF(
                                (
                                    SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                                )
                                ,
                                (
                                    ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY )
                                )
                            )
                        ) AS hari_terlewat,
                        spt.denda AS syarat_pembayaran_denda,
                        IFNULL((
                            SELECT 
                                SUM(rrpbt2.retur)
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt2
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt2 ON rpbt2.uuid = rrpbt2.retur_penjualan_barang
                            WHERE rpbt2.tanggal < (		
                                SELECT ppbt.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt WHERE ppbt.uuid = "${uuid}"
                            ) 
                            AND rrpbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND rrpbt2.enabled = 1
                            AND rpbt2.enabled = 1
                        ), 0) AS retur,
                        IFNULL((
                            SELECT 
                                rppdbt.nilai_pelunasan
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt 
                            WHERE rppdbt.pelunasan_penjualan_barang = "${uuid}"
                            AND rppdbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                        ), 0) AS nilai_pelunasan,
                        (
                            SELECT 
                                rppdbt.uuid
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt
                            WHERE rppdbt.pelunasan_penjualan_barang = "${uuid}"
                            AND rppdbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                        ) AS rincian_pelunasan_denda_penjualan_barang,
                        dgt.name AS daftar_gudang_name
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
                    JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
                    JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
                    JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang
                    JOIN ${generateDatabaseName(req_id)}.jenis_barang_tab jbt ON jbt.uuid = dbt.jenis_barang 
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
                    JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = rppbt.pesanan_penjualan_barang
                    JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran 
                    WHERE fpbt.uuid = (
                        SELECT ppbt.faktur_penjualan_barang FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt WHERE ppbt.uuid = "${uuid}"
                    )
                    AND rppbt.enabled = 1
                ) AS res
            ) AS res
            ORDER BY res.id DESC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRincianPelunasanPenjualanDendaBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanDendaBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPelunasanPenjualanDendaBarangRepo = async (rincianPelunasanPenjualanDendaBarangData, req_id) => {
    rincianPelunasanPenjualanDendaBarangData = removeDotInRupiahInput(rincianPelunasanPenjualanDendaBarangData, [
        "nilai_pelunasan"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanDendaBarangModel,
        {
            pelunasan_penjualan_barang: rincianPelunasanPenjualanDendaBarangData.pelunasan_penjualan_barang,
            rincian_pesanan_penjualan_barang: rincianPelunasanPenjualanDendaBarangData.rincian_pesanan_penjualan_barang,
            hari_terlewat: rincianPelunasanPenjualanDendaBarangData.hari_terlewat,
            total_denda: rincianPelunasanPenjualanDendaBarangData.total_denda,
            denda_sudah_dibayar: rincianPelunasanPenjualanDendaBarangData.denda_sudah_dibayar,
            piutang_denda: rincianPelunasanPenjualanDendaBarangData.piutang_denda,
            nilai_pelunasan: rincianPelunasanPenjualanDendaBarangData.nilai_pelunasan,
            enabled: rincianPelunasanPenjualanDendaBarangData.enabled
        }
    )
}

export const deleteRincianPelunasanPenjualanDendaBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanDendaBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPelunasanPenjualanDendaBarangByUuidRepo = async (uuid, rincianPelunasanPenjualanDendaBarangData, req_id) => {
    rincianPelunasanPenjualanDendaBarangData = removeDotInRupiahInput(rincianPelunasanPenjualanDendaBarangData, [
        "nilai_pelunasan"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanDendaBarangModel,
        {
            pelunasan_penjualan_barang: rincianPelunasanPenjualanDendaBarangData.pelunasan_penjualan_barang,
            rincian_pesanan_penjualan_barang: rincianPelunasanPenjualanDendaBarangData.rincian_pesanan_penjualan_barang,
            hari_terlewat: rincianPelunasanPenjualanDendaBarangData.hari_terlewat,
            total_denda: rincianPelunasanPenjualanDendaBarangData.total_denda,
            denda_sudah_dibayar: rincianPelunasanPenjualanDendaBarangData.denda_sudah_dibayar,
            piutang_denda: rincianPelunasanPenjualanDendaBarangData.piutang_denda,
            nilai_pelunasan: rincianPelunasanPenjualanDendaBarangData.nilai_pelunasan
        },
        {
            uuid
        }
    )
}