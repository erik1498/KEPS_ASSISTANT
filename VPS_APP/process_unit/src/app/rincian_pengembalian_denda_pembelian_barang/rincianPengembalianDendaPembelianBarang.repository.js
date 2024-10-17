import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPengembalianDendaPembelianBarangModel from "./rincianPengembalianDendaPembelianBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPengembalianDendaPembelianBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianPengembalianDendaPembelianBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_pembelian_barang_tab WHERE pengembalian_denda_pembelian_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPengembalianDendaPembelianBarangsCount[0].count

    const rincianPengembalianDendaPembelianBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_pembelian_barang_tab WHERE pengembalian_denda_pembelian_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPengembalianDendaPembelianBarangs,
        count: rincianPengembalianDendaPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}



export const getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUIDRepo = async (uuid, req_id) => {
    const pengembalianDendaPembelianBarangs = await db.query(
        `
            SELECT 
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                dbt.name AS daftar_barang_name,
                sbt.name AS satuan_barang_name,
                dgt.name AS daftar_gudang_name,
                IFNULL((
                    SELECT 
                        rpdpbt.denda_yang_dikembalikan 
                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_pembelian_barang_tab rpdpbt 
                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_pembelian_barang
                    WHERE rpdpbt.enabled = 1
                    AND pdpbt.enabled = 1
                    AND rpdpbt.rincian_pesanan_pembelian_barang = rppbt.uuid 
                ), 0) AS denda_yang_dikembalikan,
                (
                    SELECT 
                        rpdpbt.uuid 
                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_pembelian_barang_tab rpdpbt 
                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_pembelian_barang
                    WHERE rpdpbt.enabled = 1
                    AND pdpbt.enabled = 1
                    AND rpdpbt.rincian_pesanan_pembelian_barang = rppbt.uuid 
                ) AS rincian_pengembalian_denda_pembelian_barang,
                rppbt.uuid 
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpbt ON pdpbt.faktur_pembelian_barang = fpbt.uuid 
            WHERE pdpbt.uuid = "${uuid}" 
            AND rppbt.enabled = 1
            ORDER BY rppbt.id DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return pengembalianDendaPembelianBarangs
}

export const getRincianPengembalianDendaPembelianBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPengembalianDendaPembelianBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPengembalianDendaPembelianBarangRepo = async (rincianPengembalianDendaPembelianBarangData, req_id) => {
    rincianPengembalianDendaPembelianBarangData = removeDotInRupiahInput(rincianPengembalianDendaPembelianBarangData, [
        "denda_yang_dikembalikan"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPembelianBarangModel,
        {
            pengembalian_denda_pembelian_barang: rincianPengembalianDendaPembelianBarangData.pengembalian_denda_pembelian_barang,
            rincian_pesanan_pembelian_barang: rincianPengembalianDendaPembelianBarangData.rincian_pesanan_pembelian_barang,
            denda_yang_dikembalikan: rincianPengembalianDendaPembelianBarangData.denda_yang_dikembalikan,
            enabled: rincianPengembalianDendaPembelianBarangData.enabled
        }
    )
}

export const deleteRincianPengembalianDendaPembelianBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPembelianBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPengembalianDendaPembelianBarangByUuidRepo = async (uuid, rincianPengembalianDendaPembelianBarangData, req_id) => {
    rincianPengembalianDendaPembelianBarangData = removeDotInRupiahInput(rincianPengembalianDendaPembelianBarangData, [
        "denda_yang_dikembalikan"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPembelianBarangModel,
        {
            pengembalian_denda_pembelian_barang: rincianPengembalianDendaPembelianBarangData.pengembalian_denda_pembelian_barang,
            rincian_pesanan_pembelian_barang: rincianPengembalianDendaPembelianBarangData.rincian_pesanan_pembelian_barang,
            denda_yang_dikembalikan: rincianPengembalianDendaPembelianBarangData.denda_yang_dikembalikan,
        },
        {
            uuid
        }
    )
}