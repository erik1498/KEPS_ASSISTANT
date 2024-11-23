import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPengembalianDendaPenjualanJasaModel from "./rincianPengembalianDendaPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRincianPengembalianDendaPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const rincianPengembalianDendaPenjualanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab WHERE pengembalian_denda_penjualan_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPengembalianDendaPenjualanJasasCount[0].count

    const rincianPengembalianDendaPenjualanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab WHERE pengembalian_denda_penjualan_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPengembalianDendaPenjualanJasas,
        count: rincianPengembalianDendaPenjualanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}



export const getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUIDRepo = async (uuid, req_id) => {
    const pengembalianDendaPenjualanJasas = await db.query(
        `
            SELECT 
                khbt.kode_jasa AS kategori_harga_jasa_kode_jasa,
                dbt.name AS daftar_jasa_name,
                sbt.name AS satuan_jasa_name,
                ct.name AS cabang_name,
                IFNULL((
                    SELECT 
                        SUM((rrpbt.denda_sudah_dibayar / rrpbt.jumlah) * rrpbt.retur)
                        - IFNULL((
                            SELECT 
                                SUM(rpdpbt.denda_yang_dikembalikan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab rpdpbt 
                            JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_jasa
                            WHERE rpdpbt.rincian_pesanan_penjualan_jasa = rrpbt.rincian_pesanan_penjualan_jasa
                            AND pdpbt.enabled = 1
                            AND rpdpbt.enabled = 1
                        ), 0) 
                    FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                    JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_jasa
                    WHERE rpbt.enabled = 1
                    AND rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid
                ), 0) AS denda_yang_dikembalikan,
                (
                    SELECT 
                        rpdpbt.uuid 
                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab rpdpbt 
                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_jasa
                    WHERE rpdpbt.enabled = 1
                    AND pdpbt.enabled = 1
                    AND rpdpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid 
                ) AS rincian_pengembalian_denda_penjualan_jasa,
                rppbt.uuid 
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = rppbt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = khbt.daftar_jasa
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct ON ct.uuid = sabt.cabang 
            JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpbt ON pdpbt.faktur_penjualan_jasa = fpbt.uuid 
            WHERE pdpbt.uuid = "${uuid}" 
            AND rppbt.enabled = 1
            ORDER BY rppbt.id DESC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return pengembalianDendaPenjualanJasas
}

export const getRincianPengembalianDendaPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPengembalianDendaPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPengembalianDendaPenjualanJasaRepo = async (rincianPengembalianDendaPenjualanJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPenjualanJasaModel,
        {
            pengembalian_denda_penjualan_jasa: rincianPengembalianDendaPenjualanJasaData.pengembalian_denda_penjualan_jasa,
            rincian_pesanan_penjualan_jasa: rincianPengembalianDendaPenjualanJasaData.rincian_pesanan_penjualan_jasa,
            denda_yang_dikembalikan: rincianPengembalianDendaPenjualanJasaData.denda_yang_dikembalikan,
            enabled: rincianPengembalianDendaPenjualanJasaData.enabled
        }
    )
}

export const deleteRincianPengembalianDendaPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPengembalianDendaPenjualanJasaByUuidRepo = async (uuid, rincianPengembalianDendaPenjualanJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengembalianDendaPenjualanJasaModel,
        {
            pengembalian_denda_penjualan_jasa: rincianPengembalianDendaPenjualanJasaData.pengembalian_denda_penjualan_jasa,
            rincian_pesanan_penjualan_jasa: rincianPengembalianDendaPenjualanJasaData.rincian_pesanan_penjualan_jasa,
            denda_yang_dikembalikan: rincianPengembalianDendaPenjualanJasaData.denda_yang_dikembalikan,
        },
        {
            uuid
        }
    )
}