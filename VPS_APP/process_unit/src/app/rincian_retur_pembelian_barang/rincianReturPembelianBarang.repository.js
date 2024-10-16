import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianReturPembelianBarangModel from "./rincianReturPembelianBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRincianReturPembelianBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianReturPembelianBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab WHERE retur_pembelian_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianReturPembelianBarangsCount[0].count

    const rincianReturPembelianBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab WHERE retur_pembelian_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianReturPembelianBarangs,
        count: rincianReturPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllRincianPesananPembelianBarangByReturPembelianRepo = async (uuid, req_id) => {
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
                            SUM(rppdbt2.nilai_pelunasan) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_denda_barang_tab rppdbt2
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 ON ppbt2.uuid = rppdbt2.pelunasan_pembelian_barang
                        WHERE rppdbt2.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND ppbt2.enabled = 1
                        AND ppbt2.tanggal < rpbt.tanggal
                    ), 0) AS denda_sudah_dibayar,
                    IFNULL((
                        SELECT 
                            SUM(rppbt2.nilai_pelunasan) 
                        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_pembelian_barang_tab rppbt2
                        JOIN ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_pembelian_barang
                        WHERE rppbt2.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND ppbt2.enabled = 1
                        AND ppbt2.tanggal < rpbt.tanggal
                    ), 0) AS sudah_dibayar,
                    IFNULL((
                        SELECT 
                            rrpbt.retur
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_pembelian_barang 
                        WHERE rrpbt.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ), 0 ) AS retur,
                    IFNULL((
                        SELECT 
                            rrpbt.retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_pembelian_barang 
                        WHERE rrpbt.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ),  IFNULL((
                        SELECT 
                            SUM(rrpbt.retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_pembelian_barang 
                        WHERE rpbt2.enabled = 1
                        AND rrpbt.rincian_pesanan_pembelian_barang = rppbt.uuid 
                        AND rpbt2.tanggal < rpbt.tanggal
                    ), 0)) AS retur_sebelum,
                    IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_pembelian_barang
                        WHERE rrpbt.retur_pembelian_barang = rpbt.uuid 
                        AND rrpbt.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ), 0 ) AS nilai_retur,
                    IFNULL((
                        SELECT 
                            rrpbt.nilai_retur_sebelum 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_pembelian_barang 
                        WHERE rrpbt.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND rpbt2.uuid = rpbt.uuid
                    ),  IFNULL((
                        SELECT 
                            SUM(rrpbt.nilai_retur) 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
                        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt2 ON rpbt2.uuid = rrpbt.retur_pembelian_barang 
                        WHERE rpbt2.enabled = 1
                        AND rrpbt.rincian_pesanan_pembelian_barang = rppbt.uuid 
                        AND rpbt2.tanggal < rpbt.tanggal
                    ), 0)) AS nilai_retur_sebelum,
                    (
                        SELECT 
                            rrpbt2.uuid 
                        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt2
                        WHERE rrpbt2.rincian_pesanan_pembelian_barang = rppbt.uuid
                        AND rrpbt2.retur_pembelian_barang = rpbt.uuid
                    ) AS rincian_retur_pembelian_barang,
                    rppbt.*
                FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
                JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
                JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
                JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt ON rpbt.faktur_pembelian_barang = fpbt.uuid 
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

export const getRincianReturPembelianBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianReturPembelianBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianReturPembelianBarangRepo = async (rincianReturPembelianBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPembelianBarangModel,
        {
            retur_pembelian_barang: rincianReturPembelianBarangData.retur_pembelian_barang,
            rincian_pesanan_pembelian_barang: rincianReturPembelianBarangData.rincian_pesanan_pembelian_barang,
            sudah_dibayar: rincianReturPembelianBarangData.sudah_dibayar,
            jumlah: rincianReturPembelianBarangData.jumlah,
            denda_sudah_dibayar: rincianReturPembelianBarangData.denda_sudah_dibayar,
            retur: rincianReturPembelianBarangData.retur,
            nilai_retur: rincianReturPembelianBarangData.nilai_retur,
            retur_sebelum: rincianReturPembelianBarangData.retur_sebelum,
            nilai_retur_sebelum: rincianReturPembelianBarangData.nilai_retur_sebelum,
            enabled: rincianReturPembelianBarangData.enabled
        }
    )
}

export const deleteRincianReturPembelianBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPembelianBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianReturPembelianBarangByUuidRepo = async (uuid, rincianReturPembelianBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianReturPembelianBarangModel,
        {
            retur_pembelian_barang: rincianReturPembelianBarangData.retur_pembelian_barang,
            rincian_pesanan_pembelian_barang: rincianReturPembelianBarangData.rincian_pesanan_pembelian_barang,
            sudah_dibayar: rincianReturPembelianBarangData.sudah_dibayar,
            jumlah: rincianReturPembelianBarangData.jumlah,
            denda_sudah_dibayar: rincianReturPembelianBarangData.denda_sudah_dibayar,
            retur: rincianReturPembelianBarangData.retur,
            nilai_retur: rincianReturPembelianBarangData.nilai_retur,
            retur_sebelum: rincianReturPembelianBarangData.retur_sebelum,
            nilai_retur_sebelum: rincianReturPembelianBarangData.nilai_retur_sebelum,
        },
        {
            uuid
        }
    )
}