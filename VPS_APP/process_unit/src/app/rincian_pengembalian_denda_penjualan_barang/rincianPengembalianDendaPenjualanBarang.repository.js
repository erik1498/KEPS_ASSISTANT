import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPengembalianDendaPenjualanBarangModel from "./rincianPengembalianDendaPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRincianPengembalianDendaPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianPengembalianDendaPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab WHERE pengembalian_denda_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPengembalianDendaPenjualanBarangsCount[0].count

    const rincianPengembalianDendaPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab WHERE pengembalian_denda_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPengembalianDendaPenjualanBarangs,
        count: rincianPengembalianDendaPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}



export const getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDRepo = async (uuid, req_id) => {
    const pengembalianDendaPenjualanBarangs = await db.query(
        `
            SELECT 
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                dbt.name AS daftar_barang_name,
                sbt.name AS satuan_barang_name,
                dgt.name AS daftar_gudang_name,
                IFNULL((
                    SELECT 
                        SUM((rrpbt.denda_sudah_dibayar / rrpbt.jumlah) * rrpbt.retur)
                        - IFNULL((
                            SELECT 
                                SUM(rpdpbt.denda_yang_dikembalikan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
                            JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_barang
                            WHERE rpdpbt.rincian_pesanan_penjualan_barang = rrpbt.rincian_pesanan_penjualan_barang
                            AND pdpbt.enabled = 1
                            AND rpdpbt.enabled = 1
                        ), 0) 
                    FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                    JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang
                    WHERE rpbt.enabled = 1
                    AND rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                ), 0) AS denda_yang_dikembalikan,
                (
                    SELECT 
                        rpdpbt.uuid 
                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_barang
                    WHERE rpdpbt.enabled = 1
                    AND pdpbt.enabled = 1
                    AND rpdpbt.rincian_pesanan_penjualan_barang = rppbt.uuid 
                ) AS rincian_pengembalian_denda_penjualan_barang,
                rppbt.uuid 
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.faktur_penjualan_barang = fpbt.uuid 
            WHERE pdpbt.uuid = "${uuid}" 
            AND rppbt.enabled = 1
            ORDER BY rppbt.id DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return pengembalianDendaPenjualanBarangs
}

export const getRincianPengembalianDendaPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPengembalianDendaPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPengembalianDendaPenjualanBarangRepo = async (rincianPengembalianDendaPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPenjualanBarangModel,
        {
            pengembalian_denda_penjualan_barang: rincianPengembalianDendaPenjualanBarangData.pengembalian_denda_penjualan_barang,
            rincian_pesanan_penjualan_barang: rincianPengembalianDendaPenjualanBarangData.rincian_pesanan_penjualan_barang,
            denda_yang_dikembalikan: rincianPengembalianDendaPenjualanBarangData.denda_yang_dikembalikan,
            enabled: rincianPengembalianDendaPenjualanBarangData.enabled
        }
    )
}

export const deleteRincianPengembalianDendaPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPengembalianDendaPenjualanBarangByUuidRepo = async (uuid, rincianPengembalianDendaPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPenjualanBarangModel,
        {
            pengembalian_denda_penjualan_barang: rincianPengembalianDendaPenjualanBarangData.pengembalian_denda_penjualan_barang,
            rincian_pesanan_penjualan_barang: rincianPengembalianDendaPenjualanBarangData.rincian_pesanan_penjualan_barang,
            denda_yang_dikembalikan: rincianPengembalianDendaPenjualanBarangData.denda_yang_dikembalikan,
        },
        {
            uuid
        }
    )
}