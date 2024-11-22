import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPelunasanPenjualanJasaModel from "./rincianPelunasanPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPelunasanPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const rincianPelunasanPenjualanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab WHERE pelunasan_penjualan_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPelunasanPenjualanJasasCount[0].count

    const rincianPelunasanPenjualanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab WHERE pelunasan_penjualan_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPelunasanPenjualanJasas,
        count: rincianPelunasanPenjualanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllRincianPesananPenjualanJasaByPelunasanPenjualanRepo = async (uuid, tanggal, faktur_penjualan_jasa, req_id) => {
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
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_jasa 
                        WHERE rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND rrpbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND rpbt.tanggal <${!tanggal ? `(
                            SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                        )` : `"=${tanggal}"`}
                    ), 0) AS retur,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_jasa 
                        WHERE rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND rrpbt.enabled = 1
                        AND rpbt.enabled = 1
                        AND rpbt.tanggal <${!tanggal ? `(
                            SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                        )` : `"=${tanggal}"`}
                    ), 0) AS nilai_retur,
                    (
                        SELECT 
                            rppbt2.uuid
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppbt2 
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_jasa 
                        WHERE ppbt2.uuid = "${uuid}"
                        AND rppbt2.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND rppbt2.enabled = 1
                        AND ppbt2.enabled = 1
                    ) AS rincian_pelunasan_penjualan_jasa,
                    IFNULL((
                        SELECT 
                            SUM(rppbt2.nilai_pelunasan) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppbt2
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_jasa
                        WHERE rppbt2.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND ppbt2.enabled = 1
                        AND ppbt2.tanggal <${!tanggal ? `(
                            SELECT ppbt3.tanggal FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt3 WHERE ppbt3.uuid = "${uuid}"
                        )` : `"=${tanggal}"`}
                    ), 0) AS sudah_dibayar,
                    ${!tanggal ? `
                        IFNULL((
                            SELECT 
                                rppbt2.nilai_pelunasan 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppbt2 
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_jasa 
                            WHERE ppbt2.uuid = "${uuid}"
                            AND ppbt2.enabled = 1
                            AND rppbt2.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        ), 0) AS nilai_pelunasan,` : 
                    ``}
                    rppbt.uuid, 
                    khbt.kode_jasa AS kategori_harga_jasa_kode_jasa,
                    dbt.name AS daftar_jasa_name,
                    ct.name AS cabang_name,
                    sbt.name AS satuan_jasa_name,
                    rppbt.harga,
                    rppbt.ppn,
                    rppbt.harga_setelah_diskon,
                    rppbt.ppn_setelah_diskon,
                    rppbt.jumlah,
                    rppbt.diskon_angka,
                    rppbt.diskon_persentase,
                    rppbt.id
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = rppbt.kategori_harga_jasa 
                JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
                JOIN ${generateDatabaseName(req_id)}.cabang_tab ct ON ct.uuid = sabt.cabang
                JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = khbt.daftar_jasa
                JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa
                JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = rppbt.pesanan_penjualan_jasa 
                WHERE fpbt.uuid = ${!tanggal ? `(
                    SELECT ppbt.faktur_penjualan_jasa FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt WHERE ppbt.uuid = "${uuid}"
                )` : `"${faktur_penjualan_jasa}"`}
                AND rppbt.enabled = 1
            ) AS res
            ORDER BY res.id DESC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRincianPelunasanPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPelunasanPenjualanJasaRepo = async (rincianPelunasanPenjualanJasaData, req_id) => {
    rincianPelunasanPenjualanJasaData = removeDotInRupiahInput(rincianPelunasanPenjualanJasaData, [
        "nilai_pelunasan"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanJasaModel,
        {
            pelunasan_penjualan_jasa: rincianPelunasanPenjualanJasaData.pelunasan_penjualan_jasa,
            rincian_pesanan_penjualan_jasa: rincianPelunasanPenjualanJasaData.rincian_pesanan_penjualan_jasa,
            sudah_dibayar: rincianPelunasanPenjualanJasaData.sudah_dibayar,
            piutang: rincianPelunasanPenjualanJasaData.piutang,
            nilai_pelunasan: rincianPelunasanPenjualanJasaData.nilai_pelunasan,
            enabled: rincianPelunasanPenjualanJasaData.enabled
        }
    )
}

export const deleteRincianPelunasanPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPelunasanPenjualanJasaByUuidRepo = async (uuid, rincianPelunasanPenjualanJasaData, req_id) => {
    rincianPelunasanPenjualanJasaData = removeDotInRupiahInput(rincianPelunasanPenjualanJasaData, [
        "nilai_pelunasan"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanJasaModel,
        {
            pelunasan_penjualan_jasa: rincianPelunasanPenjualanJasaData.pelunasan_penjualan_jasa,
            rincian_pesanan_penjualan_jasa: rincianPelunasanPenjualanJasaData.rincian_pesanan_penjualan_jasa,
            sudah_dibayar: rincianPelunasanPenjualanJasaData.sudah_dibayar,
            piutang: rincianPelunasanPenjualanJasaData.piutang,
            nilai_pelunasan: rincianPelunasanPenjualanJasaData.nilai_pelunasan,
        },
        {
            uuid
        }
    )
}