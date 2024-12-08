import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriHargaBahanBakuModel from "./kategoriHargaBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllKategoriHargaBahanBakuRepo = async (daftar_bahan_baku, pageNumber, size, search, req_id) => {
    const kategoriHargaBahanBakusCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt ON dbt.uuid = khbt.daftar_bahan_baku
            JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku 
            WHERE sbt.name LIKE '%${search}%'
            AND sbt.enabled = 1 
            AND dbt.enabled = 1 
            AND khbt.enabled = 1
            AND khbt.daftar_bahan_baku = "${daftar_bahan_baku}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriHargaBahanBakusCount[0].count

    const kategoriHargaBahanBakus = await db.query(
        `
            SELECT 
                khbt.*,
                dbt.name AS daftar_bahan_baku_name,
                sbt.name AS satuan_bahan_baku_name
            FROM ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt ON dbt.uuid = khbt.daftar_bahan_baku
            JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku 
            WHERE sbt.name LIKE '%${search}%'
            AND sbt.enabled = 1 
            AND dbt.enabled = 1 
            AND khbt.enabled = 1
            AND khbt.daftar_bahan_baku = "${daftar_bahan_baku}"
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriHargaBahanBakus,
        count: kategoriHargaBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReportRepo = async (daftar_bahan_baku, satuan_bahan_baku, req_id) => {
    return await db.query(
        `
            SELECT 
                khbt.kode_bahan_baku,
                khbt.harga_beli,
                ppbt.tanggal_pesanan_pembelian_bahan_baku,
                st.name AS supplier_name
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_bahan_baku_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_bahan_baku_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt ON khbt.uuid = rppbt.kategori_harga_bahan_baku 
            WHERE khbt.satuan_bahan_baku = "${satuan_bahan_baku}"
            AND khbt.daftar_bahan_baku = "${daftar_bahan_baku}"
            ORDER BY khbt.harga_beli ASC, ppbt.tanggal_pesanan_pembelian_bahan_baku DESC 
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
}

export const getKategoriHargaBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriHargaBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKategoriHargaBahanBakuRepo = async (kategoriHargaBahanBakuData, req_id) => {
    kategoriHargaBahanBakuData = removeDotInRupiahInput(kategoriHargaBahanBakuData, [
        "harga_beli",
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaBahanBakuModel,
        {
            daftar_bahan_baku: kategoriHargaBahanBakuData.daftar_bahan_baku,
            kode_bahan_baku: kategoriHargaBahanBakuData.kode_bahan_baku,
            satuan_bahan_baku: kategoriHargaBahanBakuData.satuan_bahan_baku,
            harga_beli: kategoriHargaBahanBakuData.harga_beli,
            enabled: kategoriHargaBahanBakuData.enabled
        }
    )
}

export const deleteKategoriHargaBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriHargaBahanBakuByUuidRepo = async (uuid, kategoriHargaBahanBakuData, req_id) => {
    kategoriHargaBahanBakuData = removeDotInRupiahInput(kategoriHargaBahanBakuData, [
        "harga_beli",
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaBahanBakuModel,
        {
            daftar_bahan_baku: kategoriHargaBahanBakuData.daftar_bahan_baku,
            kode_bahan_baku: kategoriHargaBahanBakuData.kode_bahan_baku,
            satuan_bahan_baku: kategoriHargaBahanBakuData.satuan_bahan_baku,
            harga_beli: kategoriHargaBahanBakuData.harga_beli,
        },
        {
            uuid
        }
    )
}

export const getKategoriHargaBahanBakuByKodeBahanBakuRepo = async (uuid, kode_bahan_baku, req_id) => {
    return await db.query(
        `
            SELECT
                khbt.*
            FROM ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt
            ${uuid ? `WHERE khbt.uuid != "${uuid}"` : ``}
            ${uuid ? `AND khbt.kode_bahan_baku = "${kode_bahan_baku}"` : `WHERE khbt.kode_bahan_baku = "${kode_bahan_baku}"`}
            AND khbt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}