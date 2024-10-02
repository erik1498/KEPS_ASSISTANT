import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianPelunasanPenjualanBarangModel from "./rincianPelunasanPenjualanBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRincianPelunasanPenjualanBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianPelunasanPenjualanBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab WHERE pelunasan_penjualan LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianPelunasanPenjualanBarangsCount[0].count

    const rincianPelunasanPenjualanBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab WHERE pelunasan_penjualan LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianPelunasanPenjualanBarangs,
        count: rincianPelunasanPenjualanBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllRincianPesananPenjualanBarangByPelunasanPenjualanRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                rppbt.* 
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.faktur_penjualan_barang = fpbt.uuid 
            WHERE ppbt2.uuid = "${uuid}"
            AND rppbt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const getRincianPelunasanPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianPelunasanPenjualanBarangRepo = async (rincianPelunasanPenjualanBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanBarangModel,
        {
            pelunasan_penjualan: rincianPelunasanPenjualanBarangData.pelunasan_penjualan,
            rincian_pesanan_penjualan: rincianPelunasanPenjualanBarangData.rincian_pesanan_penjualan,
            sudah_dibayar: rincianPelunasanPenjualanBarangData.sudah_dibayar,
            piutang: rincianPelunasanPenjualanBarangData.piutang,
            nilai_pelunasan: rincianPelunasanPenjualanBarangData.nilai_pelunasan,
            enabled: rincianPelunasanPenjualanBarangData.enabled
        }
    )
}

export const deleteRincianPelunasanPenjualanBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianPelunasanPenjualanBarangByUuidRepo = async (uuid, rincianPelunasanPenjualanBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianPelunasanPenjualanBarangModel,
        {
            pelunasan_penjualan: rincianPelunasanPenjualanBarangData.pelunasan_penjualan,
            rincian_pesanan_penjualan: rincianPelunasanPenjualanBarangData.rincian_pesanan_penjualan,
            sudah_dibayar: rincianPelunasanPenjualanBarangData.sudah_dibayar,
            piutang: rincianPelunasanPenjualanBarangData.piutang,
            nilai_pelunasan: rincianPelunasanPenjualanBarangData.nilai_pelunasan,
        },
        {
            uuid
        }
    )
}