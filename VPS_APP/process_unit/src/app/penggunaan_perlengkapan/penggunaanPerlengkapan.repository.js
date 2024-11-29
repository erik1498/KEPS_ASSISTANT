import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import PenggunaanPerlengkapanModel from "./penggunaanPerlengkapan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllPenggunaanPerlengkapanRepo = async (pageNumber, size, search, req_id) => {
    const penggunaanPerlengkapansCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count 
            FROM ${generateDatabaseName(req_id)}.penggunaan_perlengkapan_tab ppt
            JOIN ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt ON dpt.uuid = ppt.daftar_perlengkapan
            WHERE ppt.tanggal 
            LIKE '%${search}%' 
            AND ppt.enabled = 1
            AND dpt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : penggunaanPerlengkapansCount[0].count

    const penggunaanPerlengkapans = await db.query(
        `
            SELECT 
                ppt.*,
                dpt.name AS daftar_perlengkapan_name
            FROM ${generateDatabaseName(req_id)}.penggunaan_perlengkapan_tab ppt
            JOIN ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt ON dpt.uuid = ppt.daftar_perlengkapan
            WHERE ppt.tanggal 
            LIKE '%${search}%' 
            AND ppt.enabled = 1
            AND dpt.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: penggunaanPerlengkapans,
        count: penggunaanPerlengkapansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getPenggunaanPerlengkapanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        PenggunaanPerlengkapanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createPenggunaanPerlengkapanRepo = async (penggunaanPerlengkapanData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenggunaanPerlengkapanModel,
        {
            tanggal: penggunaanPerlengkapanData.tanggal,
            jumlah: penggunaanPerlengkapanData.jumlah,
            bukti_transaksi: penggunaanPerlengkapanData.bukti_transaksi,
            daftar_perlengkapan: penggunaanPerlengkapanData.daftar_perlengkapan,
            keterangan: penggunaanPerlengkapanData.keterangan,
            enabled: penggunaanPerlengkapanData.enabled
        }
    )
}

export const deletePenggunaanPerlengkapanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenggunaanPerlengkapanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updatePenggunaanPerlengkapanByUuidRepo = async (uuid, penggunaanPerlengkapanData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        PenggunaanPerlengkapanModel,
        {
            tanggal: penggunaanPerlengkapanData.tanggal,
            jumlah: penggunaanPerlengkapanData.jumlah,
            bukti_transaksi: penggunaanPerlengkapanData.bukti_transaksi,
            daftar_perlengkapan: penggunaanPerlengkapanData.daftar_perlengkapan,
            keterangan: penggunaanPerlengkapanData.keterangan,
        },
        {
            uuid
        }
    )
}