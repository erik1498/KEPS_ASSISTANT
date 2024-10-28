import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianTransferBarangModel from "./rincianTransferBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRincianTransferBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianTransferBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab WHERE transfer_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianTransferBarangsCount[0].count

    const rincianTransferBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab WHERE transfer_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianTransferBarangs,
        count: rincianTransferBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianTransferBarangByTransferBarangUuidRepo = async (transfer_barang, req_id) => {
    const rincianTransferBarangs = await db.query(
        `
            SELECT 
                dbt.name AS daftar_barang_nama_barang,
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                sbt.name AS satuan_barang,
                sabt.uuid AS stok_awal_barang,
                (
                    SELECT 
                        rtbt.uuid
                    FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
                    WHERE tbt.uuid = "${transfer_barang}"
                    AND rtbt.stok_awal_barang = sabt.uuid 
                ) AS uuid,
                IFNULL((
                    SELECT 
                        rtbt.jumlah
                    FROM ${generateDatabaseName(req_id)}.rincian_transfer_barang_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transfer_barang_tab tbt ON tbt.uuid = rtbt.transfer_barang 
                    WHERE tbt.uuid = "${transfer_barang}"
                    AND rtbt.stok_awal_barang = sabt.uuid 
                ), 0) AS jumlah
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
            WHERE dgt.uuid = (
                SELECT 
                    tbt.daftar_gudang_asal
                FROM ${generateDatabaseName(req_id)}.transfer_barang_tab tbt 
                WHERE tbt.uuid = "${transfer_barang}"
            ) AND dbt.status = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return rincianTransferBarangs
}

export const getRincianTransferBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianTransferBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianTransferBarangRepo = async (rincianTransferBarangData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransferBarangModel,
        {
            transfer_barang: rincianTransferBarangData.transfer_barang,
            stok_awal_barang: rincianTransferBarangData.stok_awal_barang,
            jumlah: rincianTransferBarangData.jumlah,
            enabled: rincianTransferBarangData.enabled
        }
    )
}

export const deleteRincianTransferBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransferBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianTransferBarangByUuidRepo = async (uuid, rincianTransferBarangData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransferBarangModel,
        {
            transfer_barang: rincianTransferBarangData.transfer_barang,
            stok_awal_barang: rincianTransferBarangData.stok_awal_barang,
            jumlah: rincianTransferBarangData.jumlah,
        },
        {
            uuid
        }
    )
}