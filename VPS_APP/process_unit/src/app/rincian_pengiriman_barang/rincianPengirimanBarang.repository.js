import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPengirimanBarangModel from "./rincianPengirimanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianPengirimanBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianPengirimanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pengiriman_barang_tab WHERE pengiriman_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPengirimanBarangsCount[0].count

    const rincianPengirimanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pengiriman_barang_tab WHERE pengiriman_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPengirimanBarangs,
        count: rincianPengirimanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianPengirimanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPengirimanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPengirimanBarangRepo = async (rincianPengirimanBarangData, req_id) => {
    rincianPengirimanBarangData = removeDotInRupiahInput(rincianPengirimanBarangData, [
        "jumlah",
        "pengiriman"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengirimanBarangModel,
        {
            pengiriman_barang: rincianPengirimanBarangData.pengiriman_barang,
            rincian_pesanan_penjualan_barang: rincianPengirimanBarangData.rincian_pesanan_penjualan_barang,
            jumlah: rincianPengirimanBarangData.jumlah,
            pengiriman: rincianPengirimanBarangData.pengiriman,
            enabled: rincianPengirimanBarangData.enabled
        }
    )
}

export const deleteRincianPengirimanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengirimanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPengirimanBarangByUuidRepo = async (uuid, rincianPengirimanBarangData, req_id) => {
    rincianPengirimanBarangData = removeDotInRupiahInput(rincianPengirimanBarangData, [
        "jumlah",
        "pengiriman"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPengirimanBarangModel,
        {
            pengiriman_barang: rincianPengirimanBarangData.pengiriman_barang,
            rincian_pesanan_penjualan_barang: rincianPengirimanBarangData.rincian_pesanan_penjualan_barang,
            jumlah: rincianPengirimanBarangData.jumlah,
            pengiriman: rincianPengirimanBarangData.pengiriman,
        },
        {
            uuid
        }
    )
}