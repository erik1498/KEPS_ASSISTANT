import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianKonversiBarangModel from "./rincianKonversiBarang.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianKonversiBarangRepo = async (pageNumber, size, search, req_id) => {
    const rincianKonversiBarangsCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab WHERE konversi_barang LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianKonversiBarangsCount[0].count

    const rincianKonversiBarangs = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab WHERE konversi_barang LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianKonversiBarangs,
        count: rincianKonversiBarangsCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianKonversiBarangByKonversiBarangUuidRepo = async (konversi_barang, req_id) => {
    const rincianKonversiBarangs = await db.query(
        `
            SELECT 
                dbt.name AS daftar_barang_nama_barang,
                dbt.uuid AS daftar_barang_uuid,
                khbt.kode_barang AS kategori_harga_barang_kode_barang,
                sbt.uuid AS satuan_barang_uuid,
                sbt.name AS satuan_barang_name,
                sabt.uuid AS stok_awal_barang,
                (
                    SELECT 
                        rtbt.uuid
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab tbt ON tbt.uuid = rtbt.konversi_barang 
                    WHERE tbt.uuid = "${konversi_barang}"
                    AND rtbt.stok_awal_barang = sabt.uuid 
                ) AS uuid,
                IFNULL((
                    SELECT 
                        rtbt.jumlah_yang_dikonversi
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab tbt ON tbt.uuid = rtbt.konversi_barang 
                    WHERE tbt.uuid = "${konversi_barang}"
                    AND rtbt.stok_awal_barang = sabt.uuid 
                ), 0) AS jumlah_yang_dikonversi,
                (
                    SELECT 
                        rtbt.stok_awal_barang_tujuan
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab tbt ON tbt.uuid = rtbt.konversi_barang 
                    WHERE tbt.uuid = "${konversi_barang}"
                    AND rtbt.stok_awal_barang = sabt.uuid 
                ) AS stok_awal_barang_tujuan,
                IFNULL((
                    SELECT 
                        rtbt.jumlah_hasil_konversi_kode_barang_tujuan
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_barang_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_barang_tab tbt ON tbt.uuid = rtbt.konversi_barang 
                    WHERE tbt.uuid = "${konversi_barang}"
                    AND rtbt.stok_awal_barang = sabt.uuid 
                ), 0) AS jumlah_hasil_konversi_kode_barang_tujuan
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
            WHERE dgt.uuid = (
                SELECT 
                    kbt.daftar_gudang
                FROM ${generateDatabaseName(req_id)}.konversi_barang_tab kbt 
                WHERE kbt.uuid = "${konversi_barang}"
            )
            AND dbt.status = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return rincianKonversiBarangs
}

export const getRincianKonversiBarangByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianKonversiBarangModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianKonversiBarangRepo = async (rincianKonversiBarangData, req_id) => {
    rincianKonversiBarangData = removeDotInRupiahInput(rincianKonversiBarangData, [
        "jumlah_stok_awal_barang_asal", "jumlah_stok_awal_barang_akhir"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianKonversiBarangModel,
        {
            konversi_barang: rincianKonversiBarangData.konversi_barang,
            stok_awal_barang: rincianKonversiBarangData.stok_awal_barang,
            jumlah_yang_dikonversi: rincianKonversiBarangData.jumlah_yang_dikonversi,
            stok_awal_barang_tujuan: rincianKonversiBarangData.stok_awal_barang_tujuan,
            jumlah_hasil_konversi_kode_barang_tujuan: rincianKonversiBarangData.jumlah_hasil_konversi_kode_barang_tujuan,
            enabled: rincianKonversiBarangData.enabled
        }
    )
}

export const deleteRincianKonversiBarangByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianKonversiBarangModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianKonversiBarangByUuidRepo = async (uuid, rincianKonversiBarangData, req_id) => {
    rincianKonversiBarangData = removeDotInRupiahInput(rincianKonversiBarangData, [
        "jumlah_stok_awal_barang_asal", "jumlah_stok_awal_barang_akhir"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianKonversiBarangModel,
        {
            konversi_barang: rincianKonversiBarangData.konversi_barang,
            stok_awal_barang: rincianKonversiBarangData.stok_awal_barang,
            jumlah_yang_dikonversi: rincianKonversiBarangData.jumlah_yang_dikonversi,
            stok_awal_barang_tujuan: rincianKonversiBarangData.stok_awal_barang_tujuan,
            jumlah_hasil_konversi_kode_barang_tujuan: rincianKonversiBarangData.jumlah_hasil_konversi_kode_barang_tujuan,
        },
        {
            uuid
        }
    )
}