import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianReturPenjualanBarangModel from "./rincianReturPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRincianReturPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianReturPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab WHERE retur_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianReturPenjualanBarangsCount[0].count

    const rincianReturPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab WHERE retur_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianReturPenjualanBarangs,
        count: rincianReturPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllRincianPesananPenjualanBarangByReturPenjualanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT
                res.sudah_dibayar - res.nilai_retur_sebelum AS sudah_dibayar_fix,
                res.jumlah - res.retur_sebelum AS jumlah_fix,
                res.*
            FROM (
                SELECT 
                    khbt.kode_barang AS kategori_harga_barang_kode_barang,
                    dbt.name AS daftar_barang_name,
                    sbt.name AS satuan_barang_name,
                    dgt.name AS daftar_gudang_name,
                    IFNULL((
                        SELECT 
                            SUM(rppbt2.nilai_pelunasan) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt2
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_barang
                        WHERE rppbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND ppbt2.enabled = 1
                        AND ppbt2.tanggal < rpbt.tanggal
                    ), 0) AS sudah_dibayar,
                    IFNULL((
                        SELECT 
                            rrpbt.retur
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ), 0 ) AS retur,
                    IFNULL((
                        SELECT 
                            rrpbt.retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ),  IFNULL((
                        SELECT 
                            SUM(rrpbt.retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rpbt2.enabled = 1
                        AND rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid 
                        AND rpbt2.tanggal < rpbt.tanggal
                    ), 0)) AS retur_sebelum,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_barang
                        WHERE rrpbt.retur_penjualan_barang = rpbt.uuid 
                        AND rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ), 0 ) AS nilai_retur,
                    IFNULL((
                        SELECT 
                            rrpbt.nilai_retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ),  IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_barang 
                        WHERE rpbt2.enabled = 1
                        AND rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid 
                        AND rpbt2.tanggal < rpbt.tanggal
                    ), 0)) AS nilai_retur_sebelum,
                    (
                        SELECT 
                            rrpbt2.uuid 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt2
                        WHERE rrpbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                        AND rrpbt2.retur_penjualan_barang = rpbt.uuid
                    ) AS rincian_retur_penjualan_barang,
                    rppbt.*
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
                JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
                JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.faktur_penjualan_barang = fpbt.uuid 
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
                JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang
                JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
                JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
                JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
                WHERE rpbt.uuid = "${uuid}"
                AND rppbt.enabled = 1
            ) AS res
            ORDER BY res.id DESC
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRincianReturPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianReturPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianReturPenjualanBarangRepo = async (rincianReturPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPenjualanBarangModel,
        {
            retur_penjualan_barang: rincianReturPenjualanBarangData.retur_penjualan_barang,
            rincian_pesanan_penjualan_barang: rincianReturPenjualanBarangData.rincian_pesanan_penjualan_barang,
            sudah_dibayar: rincianReturPenjualanBarangData.sudah_dibayar,
            retur: rincianReturPenjualanBarangData.retur,
            nilai_retur: rincianReturPenjualanBarangData.nilai_retur,
            retur_sebelum: rincianReturPenjualanBarangData.retur_sebelum,
            nilai_retur_sebelum: rincianReturPenjualanBarangData.nilai_retur_sebelum,
            enabled: rincianReturPenjualanBarangData.enabled
        }
    )
}

export const deleteRincianReturPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianReturPenjualanBarangByUuidRepo = async (uuid, rincianReturPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPenjualanBarangModel,
        {
            retur_penjualan_barang: rincianReturPenjualanBarangData.retur_penjualan_barang,
            rincian_pesanan_penjualan_barang: rincianReturPenjualanBarangData.rincian_pesanan_penjualan_barang,
            sudah_dibayar: rincianReturPenjualanBarangData.sudah_dibayar,
            retur: rincianReturPenjualanBarangData.retur,
            nilai_retur: rincianReturPenjualanBarangData.nilai_retur,
            retur_sebelum: rincianReturPenjualanBarangData.retur_sebelum,
            nilai_retur_sebelum: rincianReturPenjualanBarangData.nilai_retur_sebelum,
        },
        {
            uuid
        }
    )
}