import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PesananPembelianBarangModel from "./pesananPembelianBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPesananPembelianBarangRepo = async (pageNumber, size, search, req_id) => {
    const pesananPembelianBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab WHERE nomor_pesanan_pembelian_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pesananPembelianBarangsCount[0].count

    const pesananPembelianBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab WHERE nomor_pesanan_pembelian_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pesananPembelianBarangs,
        count: pesananPembelianBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPesananPembelianBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PesananPembelianBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPesananPembelianBarangRepo = async (pesananPembelianBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPembelianBarangModel,
        {
            nomor_pesanan_pembelian_barang: pesananPembelianBarangData.nomor_pesanan_pembelian_barang,
            tanggal_pesanan_pembelian_barang: pesananPembelianBarangData.tanggal_pesanan_pembelian_barang,
            supplier: pesananPembelianBarangData.supplier,
            enabled: pesananPembelianBarangData.enabled
        }
    )
}

export const deletePesananPembelianBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPembelianBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePesananPembelianBarangByUuidRepo = async (uuid, pesananPembelianBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPembelianBarangModel,
        {
            nomor_pesanan_pembelian_barang: pesananPembelianBarangData.nomor_pesanan_pembelian_barang,
            tanggal_pesanan_pembelian_barang: pesananPembelianBarangData.tanggal_pesanan_pembelian_barang,
            supplier: pesananPembelianBarangData.supplier,
        },
        {
            uuid
        }
    )
}

export const getTanggalTransaksiTerakhirByPesananPembelianRepo = async (pesanan_pembelian_barang, req_id) => {
    const pesananPembelianBarang = await db.query(
        `
            SELECT 
                GREATEST(
                    ppbt.tanggal_pesanan_pembelian_barang,
                    IFNULL((
                        SELECT
                            GREATEST(
                                fpbt.tanggal,
                                IFNULL((
                                    SELECT 
                                        MAX(ppbt2.tanggal)
                                    FROM ${generateDatabaseName(req_id)}.pelunasan_pembelian_barang_tab ppbt2 
                                    WHERE ppbt2.faktur_pembelian_barang = fpbt.uuid 
                                    AND ppbt2.enabled = 1
                                ), fpbt.tanggal),
                                IFNULL((
                                    SELECT 
                                        MAX(rpbt.tanggal) 
                                    FROM ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt 
                                    WHERE rpbt.faktur_pembelian_barang = fpbt.uuid 
                                    AND rpbt.enabled = 1
                                ), fpbt.tanggal),
                                IFNULL((
                                    SELECT 
                                        MAX(pdpbt.tanggal) 
                                    FROM ${generateDatabaseName(req_id)}.pengembalian_denda_pembelian_barang_tab pdpbt 
                                    WHERE pdpbt.faktur_pembelian_barang = fpbt.uuid
                                    AND pdpbt.enabled = 1
                                ), fpbt.tanggal) 
                            )
                        FROM ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt 
                        WHERE fpbt.pesanan_pembelian_barang = ppbt.uuid 
                        AND fpbt.enabled = 1
                    ), ppbt.tanggal_pesanan_pembelian_barang)
                ) AS tanggal_terakhir_transaksi
            FROM ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt 
            WHERE ppbt.uuid = "${pesanan_pembelian_barang}"
            AND ppbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return pesananPembelianBarang
} 