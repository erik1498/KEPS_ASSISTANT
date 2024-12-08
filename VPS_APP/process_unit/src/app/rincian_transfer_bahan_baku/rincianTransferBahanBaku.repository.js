import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianTransferBahanBakuModel from "./rincianTransferBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllRincianTransferBahanBakuRepo = async (pageNumber, size, search, req_id) => {
    const rincianTransferBahanBakusCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_transfer_bahan_baku_tab WHERE transfer_bahan_baku LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianTransferBahanBakusCount[0].count

    const rincianTransferBahanBakus = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_transfer_bahan_baku_tab WHERE transfer_bahan_baku LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianTransferBahanBakus,
        count: rincianTransferBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianTransferBahanBakuByTransferBahanBakuUuidRepo = async (transfer_bahan_baku, req_id) => {
    const rincianTransferBahanBakus = await db.query(
        `
            SELECT 
                dbt.name AS daftar_bahan_baku_nama_bahan_baku,
                khbt.kode_bahan_baku AS kategori_harga_bahan_baku_kode_bahan_baku,
                sbt.name AS satuan_bahan_baku,
                sabt.uuid AS stok_awal_bahan_baku,
                (
                    SELECT 
                        rtbt.uuid
                    FROM ${generateDatabaseName(req_id)}.rincian_transfer_bahan_baku_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt ON tbt.uuid = rtbt.transfer_bahan_baku 
                    WHERE tbt.uuid = "${transfer_bahan_baku}"
                    AND rtbt.stok_awal_bahan_baku = sabt.uuid 
                ) AS uuid,
                IFNULL((
                    SELECT 
                        rtbt.jumlah
                    FROM ${generateDatabaseName(req_id)}.rincian_transfer_bahan_baku_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt ON tbt.uuid = rtbt.transfer_bahan_baku 
                    WHERE tbt.uuid = "${transfer_bahan_baku}"
                    AND rtbt.stok_awal_bahan_baku = sabt.uuid 
                ), 0) AS jumlah,
                (
                    SELECT 
                        sabt2.uuid
                    FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt2 
                    WHERE sabt2.kategori_harga_bahan_baku = khbt.uuid 
                    AND sabt2.daftar_gudang = (
                        SELECT 
                            tbt.daftar_gudang_akhir
                        FROM ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt 
                        WHERE tbt.uuid = "${transfer_bahan_baku}"
                    ) AND sabt2.enabled = 1
                ) AS stok_awal_bahan_baku_tujuan
            FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt ON khbt.uuid = sabt.kategori_harga_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt ON dbt.uuid = sabt.daftar_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku
            WHERE dgt.uuid = (
                SELECT 
                    tbt.daftar_gudang_asal
                FROM ${generateDatabaseName(req_id)}.transfer_bahan_baku_tab tbt 
                WHERE tbt.uuid = "${transfer_bahan_baku}"
            ) AND dbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return rincianTransferBahanBakus
}

export const getRincianTransferBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianTransferBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianTransferBahanBakuRepo = async (rincianTransferBahanBakuData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransferBahanBakuModel,
        {
            transfer_bahan_baku: rincianTransferBahanBakuData.transfer_bahan_baku,
            stok_awal_bahan_baku: rincianTransferBahanBakuData.stok_awal_bahan_baku,
            jumlah: rincianTransferBahanBakuData.jumlah,
            stok_awal_bahan_baku_tujuan: rincianTransferBahanBakuData.stok_awal_bahan_baku_tujuan,
            enabled: rincianTransferBahanBakuData.enabled
        }
    )
}

export const deleteRincianTransferBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransferBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianTransferBahanBakuByUuidRepo = async (uuid, rincianTransferBahanBakuData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianTransferBahanBakuModel,
        {
            transfer_bahan_baku: rincianTransferBahanBakuData.transfer_bahan_baku,
            stok_awal_bahan_baku: rincianTransferBahanBakuData.stok_awal_bahan_baku,
            jumlah: rincianTransferBahanBakuData.jumlah,
            stok_awal_bahan_baku_tujuan: rincianTransferBahanBakuData.stok_awal_bahan_baku_tujuan,
        },
        {
            uuid
        }
    )
}