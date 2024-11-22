import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import KategoriHargaJasaModel from "./kategoriHargaJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllKategoriHargaJasaRepo = async (daftar_jasa, pageNumber, size, search, req_id) => {
    const kategoriHargaJasasCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = khbt.daftar_jasa
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            WHERE sbt.name LIKE '%${search}%'
            AND sbt.enabled = 1 
            AND dbt.enabled = 1 
            AND khbt.enabled = 1
            AND khbt.daftar_jasa = "${daftar_jasa}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : kategoriHargaJasasCount[0].count

    const kategoriHargaJasas = await db.query(
        `
            SELECT 
                khbt.*,
                dbt.name AS daftar_jasa_name,
                sbt.name AS satuan_jasa_name
            FROM ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = khbt.daftar_jasa
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            WHERE sbt.name LIKE '%${search}%'
            AND sbt.enabled = 1 
            AND dbt.enabled = 1 
            AND khbt.enabled = 1
            AND khbt.daftar_jasa = "${daftar_jasa}"
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: kategoriHargaJasas,
        count: kategoriHargaJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getKategoriHargaJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        KategoriHargaJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createKategoriHargaJasaRepo = async (kategoriHargaJasaData, req_id) => {
    kategoriHargaJasaData = removeDotInRupiahInput(kategoriHargaJasaData, [
        "harga_1", "harga_2", "harga_3", "harga_4", "harga_5",
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaJasaModel,
        {
            daftar_jasa: kategoriHargaJasaData.daftar_jasa,
            kode_jasa: kategoriHargaJasaData.kode_jasa,
            satuan_jasa: kategoriHargaJasaData.satuan_jasa,
            harga_1: kategoriHargaJasaData.harga_1,
            harga_2: kategoriHargaJasaData.harga_2,
            harga_3: kategoriHargaJasaData.harga_3,
            harga_4: kategoriHargaJasaData.harga_4,
            harga_5: kategoriHargaJasaData.harga_5,
            enabled: kategoriHargaJasaData.enabled
        }
    )
}

export const deleteKategoriHargaJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateKategoriHargaJasaByUuidRepo = async (uuid, kategoriHargaJasaData, req_id) => {
    kategoriHargaJasaData = removeDotInRupiahInput(kategoriHargaJasaData, [
        "harga_beli", "harga_1", "harga_2", "harga_3", "harga_4", "harga_5",
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        KategoriHargaJasaModel,
        {
            daftar_jasa: kategoriHargaJasaData.daftar_jasa,
            kode_jasa: kategoriHargaJasaData.kode_jasa,
            satuan_jasa: kategoriHargaJasaData.satuan_jasa,
            harga_1: kategoriHargaJasaData.harga_1,
            harga_2: kategoriHargaJasaData.harga_2,
            harga_3: kategoriHargaJasaData.harga_3,
            harga_4: kategoriHargaJasaData.harga_4,
            harga_5: kategoriHargaJasaData.harga_5,
        },
        {
            uuid
        }
    )
}

export const getKategoriHargaJasaByKodeJasaRepo = async (uuid, kode_jasa, req_id) => {
    return await db.query(
        `
            SELECT
                khbt.*
            FROM ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt
            ${uuid ? `WHERE khbt.uuid != "${uuid}"` : ``}
            ${uuid ? `AND khbt.kode_jasa = "${kode_jasa}"` : `WHERE khbt.kode_jasa = "${kode_jasa}"`}
            AND khbt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}