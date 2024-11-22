import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PesananPenjualanJasaModel from "./pesananPenjualanJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPesananPenjualanJasaRepo = async (pageNumber, size, search, req_id) => {
    const pesananPenjualanJasasCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab 
            WHERE nomor_pesanan_penjualan_jasa LIKE '%${search}%' 
            AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pesananPenjualanJasasCount[0].count

    const pesananPenjualanJasas = await db.query(
        `
            SELECT 
                * 
            FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab 
            WHERE nomor_pesanan_penjualan_jasa LIKE '%${search}%' 
            AND enabled = 1 
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: pesananPenjualanJasas,
        count: pesananPenjualanJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPesananPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PesananPenjualanJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPesananPenjualanJasaRepo = async (pesananPenjualanJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPenjualanJasaModel,
        {
            nomor_pesanan_penjualan_jasa: pesananPenjualanJasaData.nomor_pesanan_penjualan_jasa,
            tanggal_pesanan_penjualan_jasa: pesananPenjualanJasaData.tanggal_pesanan_penjualan_jasa,
            customer: pesananPenjualanJasaData.customer,
            enabled: pesananPenjualanJasaData.enabled
        }
    )
}

export const deletePesananPenjualanJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPenjualanJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePesananPenjualanJasaByUuidRepo = async (uuid, pesananPenjualanJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PesananPenjualanJasaModel,
        {
            nomor_pesanan_penjualan_jasa: pesananPenjualanJasaData.nomor_pesanan_penjualan_jasa,
            tanggal_pesanan_penjualan_jasa: pesananPenjualanJasaData.tanggal_pesanan_penjualan_jasa,
            customer: pesananPenjualanJasaData.customer,
        },
        {
            uuid
        }
    )
}

export const getTanggalTransaksiTerakhirByPesananPenjualanRepo = async (pesanan_penjualan_jasa, req_id) => {
    const pesananPenjualanJasa = await db.query(
        `
            SELECT 
                GREATEST(
                    ppbt.tanggal_pesanan_penjualan_jasa,
                    IFNULL((
                        SELECT
                            GREATEST(
                                fpbt.tanggal,
                                IFNULL((
                                    SELECT 
                                        MAX(ppbt2.tanggal)
                                    FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 
                                    WHERE ppbt2.faktur_penjualan_jasa = fpbt.uuid 
                                    AND ppbt2.enabled = 1
                                ), fpbt.tanggal),
                                IFNULL((
                                    SELECT 
                                        MAX(rpbt.tanggal) 
                                    FROM ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt 
                                    WHERE rpbt.faktur_penjualan_jasa = fpbt.uuid 
                                    AND rpbt.enabled = 1
                                ), fpbt.tanggal),
                                IFNULL((
                                    SELECT 
                                        MAX(pdpbt.tanggal) 
                                    FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpbt 
                                    WHERE pdpbt.faktur_penjualan_jasa = fpbt.uuid
                                    AND pdpbt.enabled = 1
                                ), fpbt.tanggal) 
                            )
                        FROM ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt 
                        WHERE fpbt.pesanan_penjualan_jasa = ppbt.uuid 
                        AND fpbt.enabled = 1
                    ), ppbt.tanggal_pesanan_penjualan_jasa)
                ) AS tanggal_terakhir_transaksi
            FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt 
            WHERE ppbt.uuid = "${pesanan_penjualan_jasa}"
            AND ppbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return pesananPenjualanJasa
} 