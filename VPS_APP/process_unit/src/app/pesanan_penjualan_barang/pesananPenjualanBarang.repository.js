import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PesananPenjualanBarangModel from "./pesananPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPesananPenjualanBarangRepo = async (pageNumber, size, search, tahun, req_id) => {
    const pesananPenjualanBarangsCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab 
            WHERE nomor_pesanan_penjualan_barang LIKE '%${search}%' 
            AND enabled = 1
            AND YEAR(tanggal_pesanan_penjualan_barang) = ${tahun}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pesananPenjualanBarangsCount[0].count

    const pesananPenjualanBarangs = await db.query(
        `
            SELECT 
                * 
            FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab 
            WHERE nomor_pesanan_penjualan_barang LIKE '%${search}%' 
            AND enabled = 1 
            AND YEAR(tanggal_pesanan_penjualan_barang) = ${tahun}
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pesananPenjualanBarangs,
        count: pesananPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPesananPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PesananPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPesananPenjualanBarangRepo = async (pesananPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPenjualanBarangModel,
        {
            nomor_pesanan_penjualan_barang: pesananPenjualanBarangData.nomor_pesanan_penjualan_barang,
            tanggal_pesanan_penjualan_barang: pesananPenjualanBarangData.tanggal_pesanan_penjualan_barang,
            customer: pesananPenjualanBarangData.customer,
            enabled: pesananPenjualanBarangData.enabled
        }
    )
}

export const deletePesananPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePesananPenjualanBarangByUuidRepo = async (uuid, pesananPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPenjualanBarangModel,
        {
            nomor_pesanan_penjualan_barang: pesananPenjualanBarangData.nomor_pesanan_penjualan_barang,
            tanggal_pesanan_penjualan_barang: pesananPenjualanBarangData.tanggal_pesanan_penjualan_barang,
            customer: pesananPenjualanBarangData.customer,
        },
        {
            uuid
        }
    )
}

export const getTanggalTransaksiTerakhirByPesananPenjualanRepo = async (pesanan_penjualan_barang, req_id) => {
    const pesananPenjualanBarang = await db.query(
        `
            SELECT 
                GREATEST(
                    ppbt.tanggal_pesanan_penjualan_barang,
                    IFNULL((
                        SELECT
                            GREATEST(
                                fpbt.tanggal,
                                IFNULL((
                                    SELECT 
                                        MAX(ppbt2.tanggal)
                                    FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 
                                    WHERE ppbt2.faktur_penjualan_barang = fpbt.uuid 
                                    AND ppbt2.enabled = 1
                                ), fpbt.tanggal),
                                IFNULL((
                                    SELECT 
                                        MAX(rpbt.tanggal) 
                                    FROM ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt 
                                    WHERE rpbt.faktur_penjualan_barang = fpbt.uuid 
                                    AND rpbt.enabled = 1
                                ), fpbt.tanggal),
                                IFNULL((
                                    SELECT 
                                        MAX(pdpbt.tanggal) 
                                    FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt 
                                    WHERE pdpbt.faktur_penjualan_barang = fpbt.uuid
                                    AND pdpbt.enabled = 1
                                ), fpbt.tanggal) 
                            )
                        FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt 
                        WHERE fpbt.pesanan_penjualan_barang = ppbt.uuid 
                        AND fpbt.enabled = 1
                    ), ppbt.tanggal_pesanan_penjualan_barang)
                ) AS tanggal_terakhir_transaksi
            FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt 
            WHERE ppbt.uuid = "${pesanan_penjualan_barang}"
            AND ppbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return pesananPenjualanBarang
} 