import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPelunasanPenjualanBarangModel from "./rincianPelunasanPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPelunasanPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianPelunasanPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab WHERE pelunasan_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPelunasanPenjualanBarangsCount[0].count

    const rincianPelunasanPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab WHERE pelunasan_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPelunasanPenjualanBarangs,
        count: rincianPelunasanPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllRincianPesananPenjualanBarangByPelunasanPenjualanRepo = async (uuid, tanggal, faktur_penjualan_barang, req_id) => {
    return await db.query(
        `
            SELECT 
                (res.sudah_dibayar - res.nilai_retur) AS sudah_dibayar,
                (res.jumlah - res.retur) * (res.harga_setelah_diskon + res.ppn_setelah_diskon) AS total_harga,
                CASE
                    WHEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur) > 0
                    THEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur)
                    ELSE 0
                END AS piutang,
                (res.jumlah - res.retur) AS jumlah,
                res.*
            FROM (
                SELECT 
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND rrpbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND rpbt.tanggal <${!tanggal ? `(
                            SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                        )` : `"=${tanggal}"`}
                    ), 0) AS retur,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND rrpbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND rpbt.tanggal <${!tanggal ? `(
                            SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                        )` : `"=${tanggal}"`}
                    ), 0) AS nilai_retur,
                    (
                        SELECT 
                            rppbt2.uuid
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt2 
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_barang 
                        WHERE ppbt2.uuid = "${uuid}"
                        AND rppbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND rppbt2.enabled = 1
                        AND ppbt2.enabled = 1
                    ) AS rincian_pelunasan_penjualan_barang,
                    IFNULL((
                        SELECT 
                            SUM(rppbt2.nilai_pelunasan) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt2
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_barang
                        WHERE rppbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND ppbt2.enabled = 1
                        AND ppbt2.tanggal <${!tanggal ? `(
                            SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                        )` : `"=${tanggal}"`}
                    ), 0) AS sudah_dibayar,
                    ${!tanggal ? `
                        IFNULL((
                            SELECT 
                                rppbt2.nilai_pelunasan 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt2 
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_barang 
                            WHERE ppbt2.uuid = "${uuid}"
                            AND ppbt2.enabled = 1
                            AND rppbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                        ), 0) AS nilai_pelunasan,` : 
                    ``}
                    rppbt.uuid, 
                    khbt.kode_barang AS kategori_harga_barang_kode_barang,
                    dbt.name AS daftar_barang_name,
                    dgt.name AS daftar_gudang_name,
                    sbt.name AS satuan_barang_name,
                    rppbt.harga,
                    rppbt.ppn,
                    rppbt.harga_setelah_diskon,
                    rppbt.ppn_setelah_diskon,
                    rppbt.jumlah,
                    rppbt.diskon_angka,
                    rppbt.diskon_persentase,
                    rppbt.id
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
                JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
                JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
                JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
                JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = rppbt.pesanan_penjualan_barang 
                WHERE fpbt.uuid = ${!tanggal ? `(
                    SELECT ppbt.faktur_penjualan_barang FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt WHERE ppbt.uuid = "${uuid}"
                )` : `"${faktur_penjualan_barang}"`}
                AND rppbt.enabled = 1
            ) AS res
            ORDER BY res.id DESC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRincianPelunasanPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPelunasanPenjualanBarangRepo = async (rincianPelunasanPenjualanBarangData, req_id) => {
    rincianPelunasanPenjualanBarangData = removeDotInRupiahInput(rincianPelunasanPenjualanBarangData, [
        "nilai_pelunasan"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanBarangModel,
        {
            pelunasan_penjualan_barang: rincianPelunasanPenjualanBarangData.pelunasan_penjualan_barang,
            rincian_pesanan_penjualan_barang: rincianPelunasanPenjualanBarangData.rincian_pesanan_penjualan_barang,
            sudah_dibayar: rincianPelunasanPenjualanBarangData.sudah_dibayar,
            piutang: rincianPelunasanPenjualanBarangData.piutang,
            nilai_pelunasan: rincianPelunasanPenjualanBarangData.nilai_pelunasan,
            enabled: rincianPelunasanPenjualanBarangData.enabled
        }
    )
}

export const deleteRincianPelunasanPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPelunasanPenjualanBarangByUuidRepo = async (uuid, rincianPelunasanPenjualanBarangData, req_id) => {
    rincianPelunasanPenjualanBarangData = removeDotInRupiahInput(rincianPelunasanPenjualanBarangData, [
        "nilai_pelunasan"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanBarangModel,
        {
            pelunasan_penjualan_barang: rincianPelunasanPenjualanBarangData.pelunasan_penjualan_barang,
            rincian_pesanan_penjualan_barang: rincianPelunasanPenjualanBarangData.rincian_pesanan_penjualan_barang,
            sudah_dibayar: rincianPelunasanPenjualanBarangData.sudah_dibayar,
            piutang: rincianPelunasanPenjualanBarangData.piutang,
            nilai_pelunasan: rincianPelunasanPenjualanBarangData.nilai_pelunasan,
        },
        {
            uuid
        }
    )
}