import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import HasilStokOpnameModel from "./hasilStokOpname.model.js";
import { generateDatabaseName, insertQueryUtil, selectAllQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllHasilStokOpnameRepo = async (pageNumber, size, search, req_id) => {
    const hasilStokOpnamesCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : hasilStokOpnamesCount[0].count

    const hasilStokOpnames = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab WHERE tanggal LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: hasilStokOpnames,
        count: hasilStokOpnamesCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getAllBarangAktifByPerintahStokOpnameRepo = async (perintah_stok_opname, req_id) => {
    const daftarBarangs = await db.query(
        `
            SELECT 
                sabt.uuid AS stok_awal_barang,
                "" AS uuid,
                kht.kode_barang AS kategori_harga_barang_kode_barang,
                dbt.name AS daftar_barang_name,
                sbt.name AS satuan_barang_name
            FROM ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab kht ON kht.uuid = sabt.kategori_harga_barang
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = kht.satuan_barang 
            WHERE sabt.daftar_gudang = (
                SELECT psot.gudang_asal FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot WHERE psot.uuid = "${perintah_stok_opname}"
            )
            AND dbt.kategori_barang = (
                SELECT psot.kategori_barang FROM ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot WHERE psot.uuid = "${perintah_stok_opname}"
            )
            AND dbt.status = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return daftarBarangs
}

export const getHasilStokOpnameByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        HasilStokOpnameModel,
        null,
        {
            uuid,
            enabled: true
        }
    )
}

export const getHasilStokOpnameByPerintahStokOpnameRepo = async (perintah_stok_opname, req_id) => {
    return await db.query(
        `
            SELECT 
                hsot.*,
                sabt.uuid AS stok_awal_barang,
                kht.kode_barang AS kategori_harga_barang_kode_barang,
                dbt.name AS daftar_barang_name,
                sbt.name AS satuan_barang_name
            FROM ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = hsot.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab kht ON kht.uuid = sabt.kategori_harga_barang
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = kht.satuan_barang 
            WHERE hsot.perintah_stok_opname = "${perintah_stok_opname}"
            AND hsot.enabled = 1
        `,
        {
            type: Sequelize.QueryTypes.SELECT
        }
    )
}

export const createHasilStokOpnameRepo = async (hasilStokOpnameData, req_id) => {
    hasilStokOpnameData = removeDotInRupiahInput(hasilStokOpnameData, [
        "kuantitas"
    ])
    return insertQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HasilStokOpnameModel,
        {
            tanggal: hasilStokOpnameData.tanggal,
            perintah_stok_opname: hasilStokOpnameData.perintah_stok_opname,
            stok_awal_barang: hasilStokOpnameData.stok_awal_barang,
            kuantitas: hasilStokOpnameData.kuantitas,
            enabled: hasilStokOpnameData.enabled
        }
    )
}

export const deleteHasilStokOpnameByUuidRepo = async (uuid, req_id) => {
    updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HasilStokOpnameModel,
        {
            enabled: false
        },
        {
            perintah_stok_opname: uuid
        }
    )
}

export const updateHasilStokOpnameByUuidRepo = async (uuid, hasilStokOpnameData, req_id) => {
    hasilStokOpnameData = removeDotInRupiahInput(hasilStokOpnameData, [
        "kuantitas"
    ])
    return updateQueryUtil(
        req_id,
        generateDatabaseName(req_id),
        HasilStokOpnameModel,
        {
            tanggal: hasilStokOpnameData.tanggal,
            perintah_stok_opname: hasilStokOpnameData.perintah_stok_opname,
            stok_awal_barang: hasilStokOpnameData.stok_awal_barang,
            kuantitas: hasilStokOpnameData.kuantitas,
        },
        {
            uuid
        }
    )
}