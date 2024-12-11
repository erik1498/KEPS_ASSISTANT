import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import SatuanBahanBakuModel from "./satuanBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllSatuanBahanBakuRepo = async (pageNumber, size, search, req_id) => {
    const satuanBahanBakusCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab WHERE name LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : satuanBahanBakusCount[0].count

    const satuanBahanBakus = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab WHERE name LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: satuanBahanBakus,
        count: satuanBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getSatuanBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        SatuanBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createSatuanBahanBakuRepo = async (satuanBahanBakuData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanBahanBakuModel,
        {
            name: satuanBahanBakuData.name,
            enabled: satuanBahanBakuData.enabled
        }
    )
}

export const deleteSatuanBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateSatuanBahanBakuByUuidRepo = async (uuid, satuanBahanBakuData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        SatuanBahanBakuModel,
        {
            name: satuanBahanBakuData.name,
        },
        {
            uuid
        }
    )
}

export const checkSatuanBahanBakuAllowToEditRepo = async (uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                (
                    SELECT 
                        khbt.kode_bahan_baku 
                    FROM ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt
                    JOIN ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt ON dbt.uuid = khbt.daftar_bahan_baku
                    WHERE khbt.satuan_bahan_baku = sbt.uuid
                    AND khbt.enabled = 1
                    AND dbt.enabled = 1
                    LIMIT 1
                ) AS kode_bahan_baku, 
                (
                    SELECT 
                        dat.bukti_transaksi
                    FROM ${generateDatabaseName(req_id)}.daftar_aset_tab dat
                    WHERE dat.satuan_bahan_baku = sbt.uuid
                    AND dat.enabled = 1
                ) AS nomor_invoice_aset, 
                (
                    SELECT 
                        dpt.nomor_invoice
                    FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt
                    WHERE dpt.satuan_bahan_baku = sbt.uuid
                    AND dpt.enabled = 1
                ) AS nomor_invoice_perlengkapan
            FROM ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt WHERE sbt.uuid = "${uuid}"
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}