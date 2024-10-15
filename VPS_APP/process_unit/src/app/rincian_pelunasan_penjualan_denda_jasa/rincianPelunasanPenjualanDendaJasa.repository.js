import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPelunasanPenjualanDendaJasaModel from "./rincianPelunasanPenjualanDendaJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPelunasanPenjualanDendaJasaRepo = async (pageNumber, size, search, req_id) => {
    const rincianPelunasanPenjualanDendaJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_Jasa_tab WHERE pelunasan_penjualan LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPelunasanPenjualanDendaJasasCount[0].count

    const rincianPelunasanPenjualanDendaJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_Jasa_tab WHERE pelunasan_penjualan LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPelunasanPenjualanDendaJasas,
        count: rincianPelunasanPenjualanDendaJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanRepo = async (uuid, denda_status, req_id) => {
    return await db.query(
        `
            ${
                denda_status ? `SELECT 
                                    SUM(res.piutang_denda) AS denda_status
                                FROM (` : ``
            }
            SELECT 
                (res.piutang * (res.syarat_pembayaran_denda / 100) * res.hari_terlewat) AS total_denda,
                (res.piutang * (res.syarat_pembayaran_denda / 100) * res.hari_terlewat) - res.denda_sudah_dibayar AS piutang_denda,
                res.*
            FROM (
                SELECT 
                    (res.sudah_dibayar - res.nilai_retur) AS sudah_dibayar_fix,
                    CASE
                        WHEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur) > 0
                        THEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur)
                        ELSE 0
                    END AS piutang,
                    res.*
                FROM (
                    SELECT 
                        IFNULL((
                            SELECT 
                                SUM(rrpbt.retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_Jasa_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_Jasa_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_Jasa 
                            WHERE rrpbt.rincian_pesanan_penjualan_Jasa = rppbt.uuid
                            AND rrpbt.enabled = 1
                            AND rpbt.enabled = 1
                            AND rpbt.tanggal < (
                                SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                            )
                        ), 0) AS retur,
                        IFNULL((
                            SELECT 
                                SUM(rrpbt.nilai_retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_Jasa_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_Jasa_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_Jasa 
                            WHERE rrpbt.rincian_pesanan_penjualan_Jasa = rppbt.uuid
                            AND rrpbt.enabled = 1
                            AND rpbt.enabled = 1
                            AND rpbt.tanggal < (
                                SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                            )
                        ), 0) AS nilai_retur,
                        (
                            SELECT 
                                rppdbt2.uuid
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_Jasa_tab rppdbt2 
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt2 ON ppbt2.uuid = rppdbt2.pelunasan_penjualan_Jasa 
                            WHERE ppbt2.uuid = "${uuid}"
                            AND rppdbt2.rincian_pesanan_penjualan_Jasa = rppbt.uuid
                            AND rppdbt2.enabled = 1
                            AND ppbt2.enabled = 1
                        ) AS rincian_pelunasan_penjualan_denda_Jasa,
                        (
                            SELECT 
                                rppdbt2.nilai_pelunasan
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_Jasa_tab rppdbt2 
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt2 ON ppbt2.uuid = rppdbt2.pelunasan_penjualan_Jasa 
                            WHERE ppbt2.uuid = "${uuid}"
                            AND rppdbt2.rincian_pesanan_penjualan_Jasa = rppbt.uuid
                            AND rppdbt2.enabled = 1
                            AND ppbt2.enabled = 1
                        ) AS nilai_pelunasan,
                        IFNULL((
                            SELECT 
                                SUM(rppbt2.nilai_pelunasan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_Jasa_tab rppbt2
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_Jasa
                            WHERE rppbt2.rincian_pesanan_penjualan_Jasa = rppbt.uuid
                            AND ppbt2.enabled = 1
                            AND ppbt2.tanggal < (
                                SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                            ) 
                        ), 0) AS sudah_dibayar,
                        IFNULL((
                            SELECT 
                                SUM(rppdbt.nilai_pelunasan)
                                - IFNULL((
                                    SELECT 
                                        SUM(rpdpbt.denda_yang_dikembalikan) 
                                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_Jasa_tab rpdpbt 
                                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_Jasa_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_Jasa
                                    WHERE rpdpbt.rincian_pesanan_penjualan_Jasa = rppbt.uuid
                                    AND pdpbt.enabled = 1
                                    AND rpdpbt.enabled = 1
                                ), 0) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_Jasa_tab rppdbt
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_penjualan_Jasa
                            WHERE rppdbt.rincian_pesanan_penjualan_Jasa = rppbt.uuid
                            AND ppbt.tanggal < (
                                SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                            )
                            AND rppdbt.enabled = 1
                            AND ppbt.enabled = 1
                        ), 0) AS denda_sudah_dibayar, 
                        (
                            DATEDIFF(
                                (
                                    SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                                )
                                ,
                                (
                                    ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY )
                                )
                            )
                        ) AS hari_terlewat,
                        rppbt.uuid, 
                        khbt.kode_Jasa AS kategori_harga_Jasa_kode_Jasa,
                        dbt.name AS daftar_Jasa_name,
                        dgt.name AS daftar_gudang_name,
                        sbt.name AS satuan_Jasa_name,
                        rppbt.harga_setelah_diskon,
                        rppbt.ppn_setelah_diskon,
                        rppbt.jumlah,
                        rppbt.diskon_angka,
                        rppbt.diskon_persentase,
                        spt.denda AS syarat_pembayaran_denda,
                        rppbt.id
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_Jasa_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.kategori_harga_Jasa_tab khbt ON khbt.uuid = rppbt.kategori_harga_Jasa 
                    JOIN ${generateDatabaseName(req_id)}.stok_awal_Jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_Jasa 
                    JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
                    JOIN ${generateDatabaseName(req_id)}.daftar_Jasa_tab dbt ON dbt.uuid = khbt.daftar_Jasa
                    JOIN ${generateDatabaseName(req_id)}.satuan_Jasa_tab sbt ON sbt.uuid = khbt.satuan_Jasa
                    JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_Jasa_tab fpbt ON fpbt.pesanan_penjualan_Jasa = rppbt.pesanan_penjualan_Jasa 
                    JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
                    WHERE fpbt.uuid = (
                        SELECT ppbt.faktur_penjualan_Jasa FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_Jasa_tab ppbt WHERE ppbt.uuid = "${uuid}"
                    )
                    AND rppbt.enabled = 1
                ) AS res
            ) AS res
            ORDER BY res.id DESC
            ${
                denda_status ? `) AS res` : ``
            }
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRincianPelunasanPenjualanDendaJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanDendaJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPelunasanPenjualanDendaJasaRepo = async (rincianPelunasanPenjualanDendaJasaData, req_id) => {
    rincianPelunasanPenjualanDendaJasaData = removeDotInRupiahInput(rincianPelunasanPenjualanDendaJasaData, [
        "nilai_pelunasan"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanDendaJasaModel,
        {
            pelunasan_penjualan_Jasa: rincianPelunasanPenjualanDendaJasaData.pelunasan_penjualan_Jasa,
            rincian_pesanan_penjualan_Jasa: rincianPelunasanPenjualanDendaJasaData.rincian_pesanan_penjualan_Jasa,
            hari_terlewat: rincianPelunasanPenjualanDendaJasaData.hari_terlewat,
            total_denda: rincianPelunasanPenjualanDendaJasaData.total_denda,
            denda_sudah_dibayar: rincianPelunasanPenjualanDendaJasaData.denda_sudah_dibayar,
            piutang_denda: rincianPelunasanPenjualanDendaJasaData.piutang_denda,
            nilai_pelunasan: rincianPelunasanPenjualanDendaJasaData.nilai_pelunasan,
            enabled: rincianPelunasanPenjualanDendaJasaData.enabled
        }
    )
}

export const deleteRincianPelunasanPenjualanDendaJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanDendaJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPelunasanPenjualanDendaJasaByUuidRepo = async (uuid, rincianPelunasanPenjualanDendaJasaData, req_id) => {
    rincianPelunasanPenjualanDendaJasaData = removeDotInRupiahInput(rincianPelunasanPenjualanDendaJasaData, [
        "nilai_pelunasan"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanDendaJasaModel,
        {
            pelunasan_penjualan_Jasa: rincianPelunasanPenjualanDendaJasaData.pelunasan_penjualan_Jasa,
            rincian_pesanan_penjualan_Jasa: rincianPelunasanPenjualanDendaJasaData.rincian_pesanan_penjualan_Jasa,
            hari_terlewat: rincianPelunasanPenjualanDendaJasaData.hari_terlewat,
            total_denda: rincianPelunasanPenjualanDendaJasaData.total_denda,
            denda_sudah_dibayar: rincianPelunasanPenjualanDendaJasaData.denda_sudah_dibayar,
            piutang_denda: rincianPelunasanPenjualanDendaJasaData.piutang_denda,
            nilai_pelunasan: rincianPelunasanPenjualanDendaJasaData.nilai_pelunasan
        },
        {
            uuid
        }
    )
}