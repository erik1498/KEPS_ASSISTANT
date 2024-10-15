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