import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import DaftarPerlengkapanModel from "./daftarPerlengkapan.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllDaftarPerlengkapanRepo = async (pageNumber, size, search, req_id) => {
    const daftarPerlengkapansCount = await db.query(
        `
            SELECT
                COUNT(0) AS count
            FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
            JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kat ON kat.uuid = dpt.kategori_perlengkapan
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = dpt.kode_akun_perkiraan
            WHERE dpt.enabled = 1
            AND kat.enabled = 1
            AND dpt.name LIKE '%${search}%'
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : daftarPerlengkapansCount[0].count

    const daftarPerlengkapans = await db.query(
        `
            SELECT
                dpt.*,
                kat.name AS kategori_perlengkapan_name
            FROM ${generateDatabaseName(req_id)}.daftar_perlengkapan_tab dpt 
            JOIN ${generateDatabaseName(req_id)}.kategori_perlengkapan_tab kat ON kat.uuid = dpt.kategori_perlengkapan
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = dpt.kode_akun_perkiraan
            WHERE dpt.enabled = 1
            AND kat.enabled = 1
            AND dpt.name LIKE '%${search}%'
            LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: daftarPerlengkapans,
        count: daftarPerlengkapansCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getDaftarPerlengkapanByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        DaftarPerlengkapanModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const createDaftarPerlengkapanRepo = async (daftarPerlengkapanData, req_id) => {
    daftarPerlengkapanData = removeDotInRupiahInput(daftarPerlengkapanData, [
        "kuantitas", "harga_satuan", "dpp", "ppn"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarPerlengkapanModel,
        {
            name: daftarPerlengkapanData.name,
            nomor_invoice: daftarPerlengkapanData.nomor_invoice,
            kategori_perlengkapan: daftarPerlengkapanData.kategori_perlengkapan,
            kode_akun_perkiraan: daftarPerlengkapanData.kode_akun_perkiraan,
            tanggal_beli: daftarPerlengkapanData.tanggal_beli,
            supplier: daftarPerlengkapanData.supplier,
            kuantitas: daftarPerlengkapanData.kuantitas,
            satuan_barang: daftarPerlengkapanData.satuan_barang,
            harga_satuan: daftarPerlengkapanData.harga_satuan,
            dpp: daftarPerlengkapanData.dpp,
            ppn: daftarPerlengkapanData.ppn,
            enabled: daftarPerlengkapanData.enabled
        }
    )
}

export const deleteDaftarPerlengkapanByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarPerlengkapanModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateDaftarPerlengkapanByUuidRepo = async (uuid, daftarPerlengkapanData, req_id) => {
    daftarPerlengkapanData = removeDotInRupiahInput(daftarPerlengkapanData, [
        "kuantitas", "harga_satuan", "dpp", "ppn"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        DaftarPerlengkapanModel,
        {
            name: daftarPerlengkapanData.name,
            nomor_invoice: daftarPerlengkapanData.nomor_invoice,
            kategori_perlengkapan: daftarPerlengkapanData.kategori_perlengkapan,
            kode_akun_perkiraan: daftarPerlengkapanData.kode_akun_perkiraan,
            tanggal_beli: daftarPerlengkapanData.tanggal_beli,
            supplier: daftarPerlengkapanData.supplier,
            kuantitas: daftarPerlengkapanData.kuantitas,
            satuan_barang: daftarPerlengkapanData.satuan_barang,
            harga_satuan: daftarPerlengkapanData.harga_satuan,
            dpp: daftarPerlengkapanData.dpp,
            ppn: daftarPerlengkapanData.ppn,
        },
        {
            uuid
        }
    )
}