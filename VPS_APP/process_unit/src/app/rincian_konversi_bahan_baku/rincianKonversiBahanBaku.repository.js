import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RincianKonversiBahanBakuModel from "./rincianKonversiBahanBaku.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRincianKonversiBahanBakuRepo = async (pageNumber, size, search, req_id) => {
    const rincianKonversiBahanBakusCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab WHERE konversi_bahan_baku LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : rincianKonversiBahanBakusCount[0].count

    const rincianKonversiBahanBakus = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab WHERE konversi_bahan_baku LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: rincianKonversiBahanBakus,
        count: rincianKonversiBahanBakusCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRincianKonversiBahanBakuByKonversiBahanBakuUuidRepo = async (konversi_bahan_baku, req_id) => {
    const rincianKonversiBahanBakus = await db.query(
        `
            SELECT 
                dbt.name AS daftar_bahan_baku_nama_bahan_baku,
                dbt.uuid AS daftar_bahan_baku_uuid,
                khbt.kode_bahan_baku AS kategori_harga_bahan_baku_kode_bahan_baku,
                sbt.uuid AS satuan_bahan_baku_uuid,
                sbt.name AS satuan_bahan_baku_name,
                sabt.uuid AS stok_awal_bahan_baku,
                (
                    SELECT 
                        rtbt.uuid
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab tbt ON tbt.uuid = rtbt.konversi_bahan_baku 
                    WHERE tbt.uuid = "${konversi_bahan_baku}"
                    AND rtbt.stok_awal_bahan_baku = sabt.uuid 
                ) AS uuid,
                IFNULL((
                    SELECT 
                        rtbt.jumlah_yang_dikonversi
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab tbt ON tbt.uuid = rtbt.konversi_bahan_baku 
                    WHERE tbt.uuid = "${konversi_bahan_baku}"
                    AND rtbt.stok_awal_bahan_baku = sabt.uuid 
                ), 0) AS jumlah_yang_dikonversi,
                (
                    SELECT 
                        rtbt.stok_awal_bahan_baku_tujuan
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab tbt ON tbt.uuid = rtbt.konversi_bahan_baku 
                    WHERE tbt.uuid = "${konversi_bahan_baku}"
                    AND rtbt.stok_awal_bahan_baku = sabt.uuid 
                ) AS stok_awal_bahan_baku_tujuan,
                IFNULL((
                    SELECT 
                        rtbt.jumlah_hasil_konversi_kode_bahan_baku_tujuan
                    FROM ${generateDatabaseName(req_id)}.rincian_konversi_bahan_baku_tab rtbt 
                    JOIN ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab tbt ON tbt.uuid = rtbt.konversi_bahan_baku 
                    WHERE tbt.uuid = "${konversi_bahan_baku}"
                    AND rtbt.stok_awal_bahan_baku = sabt.uuid 
                ), 0) AS jumlah_hasil_konversi_kode_bahan_baku_tujuan
            FROM ${generateDatabaseName(req_id)}.stok_awal_bahan_baku_tab sabt
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_bahan_baku_tab khbt ON khbt.uuid = sabt.kategori_harga_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.daftar_bahan_baku_tab dbt ON dbt.uuid = sabt.daftar_bahan_baku 
            JOIN ${generateDatabaseName(req_id)}.satuan_bahan_baku_tab sbt ON sbt.uuid = khbt.satuan_bahan_baku
            WHERE dgt.uuid = (
                SELECT 
                    kbt.daftar_gudang
                FROM ${generateDatabaseName(req_id)}.konversi_bahan_baku_tab kbt 
                WHERE kbt.uuid = "${konversi_bahan_baku}"
            )
            AND dbt.enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return rincianKonversiBahanBakus
}

export const getRincianKonversiBahanBakuByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RincianKonversiBahanBakuModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createRincianKonversiBahanBakuRepo = async (rincianKonversiBahanBakuData, req_id) => {
    rincianKonversiBahanBakuData = removeDotInRupiahInput(rincianKonversiBahanBakuData, [
        "jumlah_stok_awal_bahan_baku_asal", "jumlah_stok_awal_bahan_baku_akhir"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianKonversiBahanBakuModel,
        {
            konversi_bahan_baku: rincianKonversiBahanBakuData.konversi_bahan_baku,
            stok_awal_bahan_baku: rincianKonversiBahanBakuData.stok_awal_bahan_baku,
            jumlah_yang_dikonversi: rincianKonversiBahanBakuData.jumlah_yang_dikonversi,
            stok_awal_bahan_baku_tujuan: rincianKonversiBahanBakuData.stok_awal_bahan_baku_tujuan,
            jumlah_hasil_konversi_kode_bahan_baku_tujuan: rincianKonversiBahanBakuData.jumlah_hasil_konversi_kode_bahan_baku_tujuan,
            enabled: rincianKonversiBahanBakuData.enabled
        }
    )
}

export const deleteRincianKonversiBahanBakuByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianKonversiBahanBakuModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRincianKonversiBahanBakuByUuidRepo = async (uuid, rincianKonversiBahanBakuData, req_id) => {
    rincianKonversiBahanBakuData = removeDotInRupiahInput(rincianKonversiBahanBakuData, [
        "jumlah_stok_awal_bahan_baku_asal", "jumlah_stok_awal_bahan_baku_akhir"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        RincianKonversiBahanBakuModel,
        {
            konversi_bahan_baku: rincianKonversiBahanBakuData.konversi_bahan_baku,
            stok_awal_bahan_baku: rincianKonversiBahanBakuData.stok_awal_bahan_baku,
            jumlah_yang_dikonversi: rincianKonversiBahanBakuData.jumlah_yang_dikonversi,
            stok_awal_bahan_baku_tujuan: rincianKonversiBahanBakuData.stok_awal_bahan_baku_tujuan,
            jumlah_hasil_konversi_kode_bahan_baku_tujuan: rincianKonversiBahanBakuData.jumlah_hasil_konversi_kode_bahan_baku_tujuan,
        },
        {
            uuid
        }
    )
}