import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PesananPenjualanBarangModel from "./pesananPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPesananPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const pesananPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab WHERE nomor_pesanan_penjualan_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : pesananPenjualanBarangsCount[0].count

    const pesananPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab WHERE nomor_pesanan_penjualan_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
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