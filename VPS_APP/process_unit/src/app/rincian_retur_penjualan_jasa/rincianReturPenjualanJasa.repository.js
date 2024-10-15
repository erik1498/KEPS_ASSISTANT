import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianReturPenjualanJasaModel from "./rincianReturPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRincianReturPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const rincianReturPenjualanJasasCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab WHERE retur_penjualan_jasa LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianReturPenjualanJasasCount[0].count

    const rincianReturPenjualanJasas = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab WHERE retur_penjualan_jasa LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianReturPenjualanJasas,
        count: rincianReturPenjualanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllRincianPesananPenjualanJasaByReturPenjualanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT
                res.sudah_dibayar - res.nilai_retur_sebelum AS sudah_dibayar_fix,
                res.jumlah - res.retur_sebelum AS jumlah_fix,
                res.*
            FROM (
                SELECT 
                    khbt.kode_jasa AS kategori_harga_jasa_kode_jasa,
                    dbt.name AS daftar_jasa_name,
                    sbt.name AS satuan_jasa_name,
                    dgt.name AS daftar_gudang_name,
                    IFNULL((
                        SELECT 
                            SUM(rppdbt2.nilai_pelunasan) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_jasa_tab rppdbt2
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppdbt2.pelunasan_penjualan_jasa
                        WHERE rppdbt2.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND ppbt2.enabled = 1
                        AND ppbt2.tanggal < rpbt.tanggal
                    ), 0) AS denda_sudah_dibayar,
                    IFNULL((
                        SELECT 
                            SUM(rppbt2.nilai_pelunasan) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppbt2
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_jasa
                        WHERE rppbt2.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND ppbt2.enabled = 1
                        AND ppbt2.tanggal < rpbt.tanggal
                    ), 0) AS sudah_dibayar,
                    IFNULL((
                        SELECT 
                            rrpbt.retur
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_jasa 
                        WHERE rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ), 0 ) AS retur,
                    IFNULL((
                        SELECT 
                            rrpbt.retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_jasa 
                        WHERE rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ),  IFNULL((
                        SELECT 
                            SUM(rrpbt.retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_jasa 
                        WHERE rpbt2.enabled = 1
                        AND rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid 
                        AND rpbt2.tanggal < rpbt.tanggal
                    ), 0)) AS retur_sebelum,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_jasa
                        WHERE rrpbt.retur_penjualan_jasa = rpbt.uuid 
                        AND rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ), 0 ) AS nilai_retur,
                    IFNULL((
                        SELECT 
                            rrpbt.nilai_retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_jasa 
                        WHERE rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ),  IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_penjualan_jasa 
                        WHERE rpbt2.enabled = 1
                        AND rrpbt.rincian_pesanan_penjualan_jasa = rppbt.uuid 
                        AND rpbt2.tanggal < rpbt.tanggal
                    ), 0)) AS nilai_retur_sebelum,
                    (
                        SELECT 
                            rrpbt2.uuid 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt2
                        WHERE rrpbt2.rincian_pesanan_penjualan_jasa = rppbt.uuid
                        AND rrpbt2.retur_penjualan_jasa = rpbt.uuid
                    ) AS rincian_retur_penjualan_jasa,
                    rppbt.*
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
                JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
                JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.faktur_penjualan_jasa = fpbt.uuid 
                JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = rppbt.kategori_harga_jasa 
                JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = khbt.daftar_jasa
                JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
                JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
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

export const getRincianReturPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianReturPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianReturPenjualanJasaRepo = async (rincianReturPenjualanJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPenjualanJasaModel,
        {
            retur_penjualan_jasa: rincianReturPenjualanJasaData.retur_penjualan_jasa,
            rincian_pesanan_penjualan_jasa: rincianReturPenjualanJasaData.rincian_pesanan_penjualan_jasa,
            sudah_dibayar: rincianReturPenjualanJasaData.sudah_dibayar,
            jumlah: rincianReturPenjualanJasaData.jumlah,
            denda_sudah_dibayar: rincianReturPenjualanJasaData.denda_sudah_dibayar,
            retur: rincianReturPenjualanJasaData.retur,
            nilai_retur: rincianReturPenjualanJasaData.nilai_retur,
            retur_sebelum: rincianReturPenjualanJasaData.retur_sebelum,
            nilai_retur_sebelum: rincianReturPenjualanJasaData.nilai_retur_sebelum,
            enabled: rincianReturPenjualanJasaData.enabled
        }
    )
}

export const deleteRincianReturPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianReturPenjualanJasaByUuidRepo = async (uuid, rincianReturPenjualanJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPenjualanJasaModel,
        {
            retur_penjualan_jasa: rincianReturPenjualanJasaData.retur_penjualan_jasa,
            rincian_pesanan_penjualan_jasa: rincianReturPenjualanJasaData.rincian_pesanan_penjualan_jasa,
            sudah_dibayar: rincianReturPenjualanJasaData.sudah_dibayar,
            jumlah: rincianReturPenjualanJasaData.jumlah,
            denda_sudah_dibayar: rincianReturPenjualanJasaData.denda_sudah_dibayar,
            retur: rincianReturPenjualanJasaData.retur,
            nilai_retur: rincianReturPenjualanJasaData.nilai_retur,
            retur_sebelum: rincianReturPenjualanJasaData.retur_sebelum,
            nilai_retur_sebelum: rincianReturPenjualanJasaData.nilai_retur_sebelum,
        },
        {
            uuid
        }
    )
}