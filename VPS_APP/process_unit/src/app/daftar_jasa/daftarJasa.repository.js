import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarJasaModel from "./daftarJasa.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";

export const getAllDaftarJasaRepo = async (pageNumber, size, search, req_id) => {
    const daftarJasasCount = await db.query(
        `
            SELECT 
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt 
            JOIN ${generateDatabaseName(req_id)}.kategori_jasa_tab kbt ON kbt.uuid = dbt.kategori_jasa 
            JOIN ${generateDatabaseName(req_id)}.jenis_jasa_tab jbt ON jbt.uuid = dbt.jenis_jasa 
            JOIN ${generateDatabaseName(req_id)}.jenis_penjualan_jasa_tab jpbt ON jpbt.uuid = dbt.jenis_penjualan_jasa 
            WHERE dbt.name LIKE '%${search}%' 
            AND dbt.enabled = 1
            AND kbt.enabled = 1
            AND jbt.enabled = 1
            AND jpbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarJasasCount[0].count

    const daftarJasas = await db.query(
        `
            SELECT 
                dbt.*,
                kbt.name AS kategori_jasa_name,
                jbt.name AS jenis_jasa_name,
                jpbt.name AS jenis_penjualan_jasa_name
            FROM ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt 
            JOIN ${generateDatabaseName(req_id)}.kategori_jasa_tab kbt ON kbt.uuid = dbt.kategori_jasa 
            JOIN ${generateDatabaseName(req_id)}.jenis_jasa_tab jbt ON jbt.uuid = dbt.jenis_jasa 
            JOIN ${generateDatabaseName(req_id)}.jenis_penjualan_jasa_tab jpbt ON jpbt.uuid = dbt.jenis_penjualan_jasa 
            WHERE dbt.name LIKE '%${search}%' 
            AND dbt.enabled = 1
            AND kbt.enabled = 1
            AND jbt.enabled = 1
            AND jpbt.enabled = 1
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: daftarJasas,
        count: daftarJasasCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllDaftarJasasAktifByDaftarGudangRepo = async (daftar_gudang, req_id) => {
    const daftarJasas = await db.query(
        `
            SELECT 
                daftar_jasa_tab.*
            FROM daftar_jasa_tab 
            WHERE daftar_jasa_tab.status = true
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return daftarJasas
}

export const getAllDaftarJasaUntukTransaksiRepo = async (req_id) => {
    const daftarJasas = await db.query(
        `
            SELECT 
                khbt.*,
                sbt.name AS satuan_jasa_name,
                dbt.name AS daftar_jasa_name,
                dbt.ppn AS ppn,
                jbt.code AS jenis_jasa_code
            FROM ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = khbt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.jenis_jasa_tab jbt ON jbt.uuid = dbt.jenis_jasa
            WHERE dbt.enabled = 1
            AND dbt.status = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return daftarJasas
}

export const getDaftarJasaByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DaftarJasaModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDaftarJasaRepo = async (daftarJasaData, req_id) => {
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarJasaModel,
        {
            name: daftarJasaData.name,
            kategori_jasa: daftarJasaData.kategori_jasa,
            jenis_jasa: daftarJasaData.jenis_jasa,
            jenis_penjualan_jasa: daftarJasaData.jenis_penjualan_jasa,
            ppn: daftarJasaData.ppn,
            status: daftarJasaData.status,
            enabled: daftarJasaData.enabled
        }
    )
}

export const deleteDaftarJasaByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarJasaModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDaftarJasaByUuidRepo = async (uuid, daftarJasaData, req_id) => {
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarJasaModel,
        {
            name: daftarJasaData.name,
            kategori_jasa: daftarJasaData.kategori_jasa,
            jenis_jasa: daftarJasaData.jenis_jasa,
            jenis_penjualan_jasa: daftarJasaData.jenis_penjualan_jasa,
            ppn: daftarJasaData.ppn,
            status: daftarJasaData.status,
        },
        {
            uuid
        }
    )
}

export const checkDaftarJasaAllowToEditRepo = async (by_kategori_harga_jasa, uuid, req_id) => {
    return await db.query(
        `
            SELECT 
                (
                    SELECT 
                        JSON_OBJECT(
                            'nomor_pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                            'tanggal', ppbt.tanggal_pesanan_penjualan_jasa
                        ) 
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
                    WHERE rppbt.stok_awal_jasa = sabt.uuid
                    AND rppbt.enabled = 1
                    LIMIT 1
                ) AS pesanan_penjualan_jasa,
                sabt.*
            FROM ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt 
            ${by_kategori_harga_jasa ? `WHERE sabt.kategori_harga_jasa = "${uuid}"` : `WHERE sabt.daftar_jasa = "${uuid}"`
        }
            AND sabt.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}